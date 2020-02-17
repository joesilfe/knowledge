const queries = require('./queries')

module.exports = app => {
    const { existsOrError } = app.api.validation

    const save = (req, res) => {

        let dados = {}
        req.body.imageUrl === undefined ? dados = { ...req.body, imageUrl: " " } : dados = {...req.body}
        
        const article = { ...dados }
        
        if (req.params.id) article.id = req.params.id

        console.log(article)
    
        try {
            existsOrError(article.nome, 'Nome não informado')
            existsOrError(article.description, 'Descrição não informada')
            existsOrError(article.categoryId, 'Categoria não informada')
            existsOrError(article.userId, 'Autor não informado')
            existsOrError(article.content, 'Conteúdo não informado')
        } catch (msg) {
            res.status(400).send(msg + "")
        }

        if (article.id) {
            app.db('articles')
                .update(article)
                .where({ id: article.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('articles')
                .insert(article)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send("Mensgem" + err))
        }

    }

    const remove = async (req, res) => {
        try {
            const rowsDeleted = await app.db('articles')
                .where({ id: req.params.id }).del()

            try {
                // se as linhas deletedas existirem, ok. Se não, mostra a mensagem.
                existsOrError(rowsDeleted, 'Artigo não foi encontrado.')
            } catch (msg) {
                return res.status(500).send(msg)
            }

            res.status(204).send()
        } catch (msg) {
            res.status(500).send(msg)
        }
    }

    // limitando consulta paginada
    const limit = 10
    const get = async (req, res) => {
        // aguardando a página que irá receber
        const page = req.query.page || 1

        const result = await app.db('articles').count('id').first()
        const count = parseInt(result.count)

        // offset : é o descolamento, a partir de onde ele vai começar a fazer a consulta para trazer os 10 registros que representa o limit. 
        // É feito um calculo em cima de page e limit para isso.
        app.db('articles')
            .select('id', 'nome', 'description')
            .limit(limit).offset(page * limit - limit)
            .then(articles => res.json({ data: articles, count, limit }))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('articles')
            .where({ id: req.params.id })
            .first()
            .then(article => {
                // Transformando a requisição onde recebe um formato binário para um formato string
                article.content = article.content.toString()
                return res.json(article)
            })
            .catch(err => res.status(500).send(err))
    }

    const getByCategory = async (req, res) => {
        // Obtendo id através do parametro da requisição
        const categoryId = req.params.id
        // Caso a página não for informada, então é a primeira ppagina
        const page = req.query.page || 1
        // Fazendo consulta crua através do arquivo de queries
        const categories = await app.db.raw(queries.categoryWithChildren, categoryId )
        // extraindo ids : o map vai receber um array onde vou mapear e capturar o id
        const ids = categories.rows.map(c => c.id)

        app.db({a: 'articles', u: 'users'})
            .select('a.id', 'a.nome', 'a.description', 'a.imageUrl', {author: 'u.nome'})
            .limit(limit).offset(page * limit - limit) // organiza a paginação
            .whereRaw('?? = ??', ['u.id', 'a.userId']) // iguala duas tabelas para encontrar de fato os valores de cada tabela
            .whereIn('categoryId', ids) // Passando os valores de ids que filtrou com map
            .orderBy('a.id', 'desc') // odernando o maior(novos) id para o menor(antigo) id
            .then(articles => res.json(articles))
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById, getByCategory }
}