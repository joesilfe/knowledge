const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation

    // Função responsável por criptografar a senha
    const encryptPassword = password => {

        // Calculando o salt para gerar a senha criptografada
        const salt = bcrypt.genSaltSync(10)

        // Retornando o Hash da senha criptografada
        return bcrypt.hashSync(password, salt)
    }

    const save = async (req, res) => {
        // capturando todos os valores que foram digitados no formulário
        const user = { ...req.body }

        /*
            Ao fazer uma requisição do tipo post com a url [/signup], o usuário sempre terá admin setado como false, 
            apena o administrador pode salvar como admin um usuário.
        */

        // Se na minha requisição não estíver em [/users], coloque o user.admin como false
        if (!req.originalUrl.startsWith('/users')) user.admin = false

        // se (ninguem estiver logado [ou] dentro da requsição, a flag admin está false ) seta user.admin para false
        if (!req.user || !req.user.admin) user.admin = false

        //capturando o parametro id e atribuindo ao user.id
        if (req.params.id) user.id = req.params.id

        // Verificando se não houve nenhum campo em branco
        try {
            existsOrError(user.nome, 'Nome não informado')
            existsOrError(user.email, 'E-mail não informado')
            existsOrError(user.password, 'Senha não informada')
            existsOrError(user.confirmPassword, 'Confirmação de senha inválida')
            equalsOrError(user.password, user.confirmPassword, 'Senhas não conferem')

            const userFromDB = await app.db('users')
                .where({ email: user.email }).first()

            if (!user.id) {
                notExistsOrError(userFromDB, 'Usuário já cadastrado')
            }
        } catch (msg) {
            // erro do lado do cliente, usuário
            return res.status(400).send(msg)
        }

        // criptografando a senha do usuário
        user.password = encryptPassword(user.password)
        delete user.confirmPassword

        if (!user.id) {
            app.db('users')
                .insert(user)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const updateUser = async (req, res) => {
        const user = { ...req.body }

         //capturando o parametro id e atribuindo ao user.id
         if (req.params.id) user.id = req.params.id

        try {
            existsOrError(user.nome, 'Nome não informado')
            existsOrError(user.email, 'E-mail não informado')

        } catch (msg) {
            // erro do lado do cliente, usuário
            return res.status(400).send(msg)
        }
        
        if (user.id) {
            await app.db('users')
                .update(user)
                .where({ id: user.id })
                .whereNull('deletedAt') // verificando se este campos está nulo
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    // metodo get é reponsável por obter todos os usuários
    const get = (req, res) => {
        app.db('users')
            .select('id', 'nome', 'email', 'admin')
            .whereNull('deletedAt') // verificando se este campos está nulo
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err))
    }

    // metodo get é reponsável por obter usuários por id
    const getById = (req, res) => {
        app.db('users')
            .select('id', 'nome', 'email', 'admin')
            .where({ id: req.params.id })
            .whereNull('deletedAt') // verificando se este campos está nulo
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err))
    }

    const remove = async (req, res) => {
        try {
            const articles = await app.db('articles')
                .where({ userId: req.params.id })
            // ou não existe ou gera um erro
            notExistsOrError(articles, 'Usuário possui artigos.')

            const rowsUpdates = await app.db('users')
                .update({ deletedAt: new Date })
                .where({ id: req.params.id })
            // existe ou erro
            existsOrError(rowsUpdates, 'Usuário não foi encontrado.')

            res.status(204).send()
        } catch (msg) {
            res.status(400).send()
        }
    }

    //Esse método é resposável por ativar usuários inativos
    const userAtivar = (req, res) => {
        app.db('users')
            .update({ deletedAt: null })
            .where({ id: req.params.id })
            .then(_ => res.status(200).send())
            .catch(err => res.status(500).send(err))
    }

    // metodo get é reponsável por obter todos os usuários
    const getInativo = (req, res) => {
        app.db('users')
            .select('id', 'nome', 'email', 'admin', 'deletedAt')
            .whereNotNull('deletedAt') // encontre todos que são diferentes de null
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err))
    }

    return { save, updateUser, get, getById, remove, userAtivar, getInativo }
}