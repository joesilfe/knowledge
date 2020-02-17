const { authSecret } = require('../.env') // importando arquivo env
const jwt = require('jwt-simple') // estratégia de autenticação para APIs em REST simples e segura
const bcrypt = require('bcrypt-nodejs') // Compara senha do banco e da requisição

module.exports = app => {
    const signin = async (req, res) => {
        // Validando e-mail e senha no bady requisição
        if (!req.body.email || !req.body.password) {
            return res.stauts(400).send('Informe o usuário e senha!')
        }

        // consultado e-mail que recebi no body da requisição
        const user = await app.db('users')
            .where({ email: req.body.email })
            .first()

        // verificando se o usuário não existe
        if (!user) return res.status(400).send('Usuário não encontrado!')

        // comparando o password do bory da requisição com o a senha gravada no banco, para isso devo utilizar o comparaSync pois está criptografada
        const isMatch = bcrypt.compareSync(req.body.password, user.password)
        if (!isMatch) return res.status(401).send('Email/senha inválidos!')

        // Math.floor : Arredonda valor; now : retorna o valor em segundos
        const now = Math.floor(Date.now() / 1000)

        // Criando dados para colocar dentro do token
        const payload = {
            id: user.id,
            name: user.nome,
            email: user.email,
            admin: user.admin,
            iat: now, // issued at : data da geração do token
            exp: now + (60 * 60 * 60 * 24 * 3)  //(segundos * minutos * hora * dia * dias)
        }
        // enviando resposta em json
        res.json({
            ...payload,
            token: jwt.encode(payload, authSecret) // Gerando o token
        })
    }

    // Validando Token
    const validateToken = async (req, res) => {
        // caso o corpo da requisição não venha setado, então é null
        const userDate = req.body || null
        try {
            // Se userDate tiver setado, chame o token            
            if (userDate) {

                const token = jwt.decode(userDate.token, authSecret)

                // Se a data do token de expiração for maior que atual
                if (new Date(token.exp * 1000) > new Date()) {
                    //Token está valido
                    return res.send(true)
                }
            }
        } catch (e) {
            // Problema no token
            res.status(500).send(e)
        }

        res.send(false)
    }

    // Fazer lógica onde verifica se o usuário é admin ou para poder acessar uma rota
    // Validando user
    const validateAdminUser = async (req, res) => {
        // caso o corpo da requisição não venha setado, então é null
        const userDate = req.body || null

        
        try {
            // Se userDate tiver setado, chame o token            
            if (userDate) {
                
                const token = jwt.decode(userDate.token, authSecret)
                
                // Se a data do token de expiração for maior que atual
                if (new Date(token.exp * 1000) > new Date()) {
                    await app.db('users')
                        .select('admin')
                        .where({ id: token.id })
                        .whereNull('deletedAt') // verificando se este campos está nulo
                        .then(users => res.json(users))
                        .catch(err => res.status(500).send(err))

                    //Token está valido
                    return
                }
            }
        } catch (e) {
            // Problema no token
            res.status(500).send(e)
        }

        res.send(false)
    }

    return { signin, validateToken, validateAdminUser }
}