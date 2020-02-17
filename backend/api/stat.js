module.exports = app => {
    // Criando modelo do banco de dados
    const Stat = app.mongoose.model('Stat', {
        users: Number,
        categories: Number,
        articles: Number,
        createdAt: Date
    })

    // Método get
    const get = (req, res) => {
        // acessando o mongodb
        // ModeloDoBanco.pegaUm({não vou filtrar nada}, {Não selecione nenhum tipo de atributo}, { pegue a ultima estatistica cadastrada no mongo DB } })
        Stat.findOne({}, {}, { sort: { 'createdAt': -1 } })
            // pegando o resultado da estatiscica e transformando em JSON
            .then(stat => {
                const defaultState = {
                    users: 0,
                    categories: 0,
                    articles: 0
                }
                res.json(stat || defaultState)
            })
    }

    return { Stat, get }
}