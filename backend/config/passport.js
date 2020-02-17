const { authSecret } = require('../.env')
const passport = require('passport') // validador
const passportJwt = require('passport-jwt') // responsável por ler o validador
const { Strategy, ExtractJwt} = passportJwt

module.exports = app => {
    const params = {
        secretOrKey: authSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() // Responsável por procurar no cabeçalho da requisição e extrait o token
    }

    const strategy  = new Strategy(params, (payload, done) => {
        app.db('users')
            .where({id: payload.id})
            .first()
            .then(user => done(null, user ? { ...payload } : false))
            .catch(err => done(err, false))
        })
    passport.use(strategy)

    return {
        authenticate: () => passport.authenticate('jwt', {session: false})
    }
}