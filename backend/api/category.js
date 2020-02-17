module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation

    const save = (req, res) => {
        const category = {
            id: req.body.id,
            name: req.body.name,
            parentId: req.body.parentId
        }        

        if (req.params.id) category.id = req.params.id

        try {
            existsOrError(category.name, 'nome não informado')
        } catch (msg) {
            return res.status(400).send(msg)
        }

        try {

            parseInt(category.id) === parseInt(category.parentId) ? notExistsOrError(category.parentId, 'Não é possível vincular em uma mesma categoria') : null
            
            if (parseInt(category.id) && !category.parentId) {
                app.db('categories')
                    .update(category)
                    .where({ id: category.id })
                    .then(_ => res.status(204).send())
                    .catch(err => res.status(500).send(err))
            } else {
                console.log('entrei no else')
                app.db('categories')
                    .insert(category)
                    .then(_ => res.status(204).send())
                    .catch(err => res.status(500).send(err))
            }
        } catch (msg) {
            console.log('entrei no catch', msg)
            return res.status(400).send(msg)
        }
    }

    const remove = async (req, res) => {
        try {
            existsOrError(req.params.id, 'Código da categoria não informado.')

            const subcategory = await app.db('categories')
                .where({ parentId: req.params.id })
            notExistsOrError(subcategory, 'Categoria possui subcategorias.')

            const articles = await app.db('articles')
                .where({ categoryId: req.params.id })
            notExistsOrError(articles, 'Categoria por artigo.')

            const rowDeleted = await app.db('categories')
                .where({ id: req.params.id }).del()
            existsOrError(rowDeleted, 'Categoria não foi encontrada.')

            res.status(204).send()
        } catch (msg) {
            res.status(400).send(msg)
        }
    }

    // Esse método recebe uma lista de categorias e envia novamente uma lista de categorias só que com atributo a mais.
    const withPath = categories => {
        // essa função pega uma categoria pai
        const getParent = (categories, parentId) => {
            // encontrando a categoria pai
            // categories filtre meu parente id que for exatamente igual ao parentId
            const parent = categories.filter(parent => parent.id === parentId)

            // O tamanho de parent é maior que zero? se for, retorna o parent, caso contrário retorna null
            return parent.length ? parent[0] : null
        }

        // Transformando categoria em um outro array de categorias com um atribudo chamado Path
        const categoriesWithPath = categories.map(category => {

            let path = category.name
            let parent = getParent(categories, category.parentId)
            while (parent) {
                path = `${parent.name} > ${path}`
                parent = getParent(categories, parent.parentId)
                break
            }

            return { ...category, path }
        })

        // sort faz uma ordenação através de uma função callback
        categoriesWithPath.sort((a, b) => {
            if (a.path < b.path) return -1
            if (a.path > b.path) return 1

            // ambos são iguais
            return 0
        })

        return categoriesWithPath
    }

    const get = (req, res) => {
        app.db('categories')
            .then(categories => res.json(withPath(categories)))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('categories')
            .where({ id: req.params.id })
            .first()
            .then(categories => res.json(categories))
            .catch(err => res.status(500).send(err))
    }

    const toTree = (categories, tree) => {
        //Se arvore não estiver setado. Então filtre todas as categorias que não possuirem ID
        if (!tree) tree = categories.filter(c => !c.parentId)
        //Mapeando os filhos de tree
        tree = tree.map(parentNode => {
            // é filho?
            const isChild = (node) => node.parentId === parentNode.id
            parentNode.children = toTree(categories, categories.filter(isChild))
            return parentNode
        })
        return tree
    }

    const getTree = (req, res) => {
        app.db('categories')
            .then(categories => res.json(toTree(withPath(categories))))
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById, getTree }
}