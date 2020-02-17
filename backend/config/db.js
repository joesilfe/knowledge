const config = require('../knexfile.js')
const knex = require('knex')(config)

// Opção para chamar a migration direto pelo arquivo db
knex.migrate.latest([config])

module.exports = knex