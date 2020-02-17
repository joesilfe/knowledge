// inserir novas tabelas, colunas e etc
exports.up = function (knex, Promise) {

    // sempre utilize o return
    // return knex.schema.createTable('nome da tabela', tabela => {})
    
    return knex.schema.createTable('users', table => {
        // Crie um tabela [users]
        // Na tabela [users], crie uma coluna [id] que auto-incrementa e seja minha chave primaria
        table.increments('id').primary()

        // Na tabela [users], crie uma coluna [nome] que seja apanas texto e não nulo
        table.string('nome').notNull()

        // Na tabela [users], crie uma coluna [email] que seja apanas texto, não nulo e unica 
        table.string('email').notNull().unique()

        // Na tabela [users], crie uma coluna [password] que seja apanas texto e não nulo
        table.string('password').notNull()

        // Na tabela [users], crie uma coluna [admin] onde seja do tipo boleano que recebe verdadeiro ou falso, que por padrão inicia qualquer dado como false
        table.boolean('admin').notNull().defaultTo(false)
    })
};

// remover novas tabelas, colunas e etc
exports.down = function (knex, Promise) {
    return knex.schema.dropTable('users')
};
