// inserir novas tabelas, colunas e etc
exports.up = function(knex, Promise) {
    // sempre utilize o return
    // return knex.schema.createTable('nome da tabela', tabela => {})

    return knex.schema.createTable('articles', table => {
        // Crie um tabela [articles]
        // Na tabela [articles], crie uma coluna [id] que auto-incrementa e seja minha chave primaria
        table.increments('id').primary()

        // Na tabela [articles], crie uma coluna [nome] que seja apanas texto e não nulo
        table.string('nome').notNull()

        // Na tabela [articles], crie uma coluna [description] que seja apanas texto, que possua no máximo 1000 caracteres e seja não nulo
        table.string('description', 1000).notNull()

        // Na tabela [articles], crie uma coluna [imageUrl] que seja apanas texto, que possua no máximo 1000 caracteres e seja não nulo
        table.string('imageUrl', 1000).notNull()

        // Na tabela [articles], crie uma coluna [imageUrl] que seja um campo binário, que possua no máximo 1000 caracteres e seja não nulo
        table.binary('content').notNull()

        // Na tabela [articles], crie uma coluna [userId] que seja um campo de inteiros e possua um auto relacionamento com [id] na tabela [users] e que seja não nulo
        table.integer('userId').references('id')
            .inTable('users').notNull()
        
        // Na tabela [articles], crie uma coluna [categoryId] que seja um campo de inteiros e possua um auto relacionamento com [id] na tabela [categories] e que seja não nulo
        table.integer('categoryId').references('id')
            .inTable('categories').notNull()
        
    })
};

// remover novas tabelas, colunas e etc
exports.down = function(knex, Promise) {
    return knex.schema.dropTable('articles')
};
