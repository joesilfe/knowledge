// inserir novas tabelas, colunas e etc
exports.up = function(knex, Promise) {

    // sempre utilize o return
    // return knex.schema.createTable('nome da tabela', tabela => {})

    return knex.schema.createTable('categories', table => {
        // Crie um tabela [categories]
        // Na tabela [categories], crie uma coluna [id] que auto-incrementa e seja minha chave primaria
        table.increments('id').primary()

        // Na tabela [categories], crie uma coluna [name] que seja apanas texto e não nulo
        table.string('name').notNull()

        // Na tabela [categories], crie uma coluna [parentId] que seja um campo de inteiros e possua um auto relacionamento com [id] na tabela [categories]
        table.integer('parentId').references('id')
            .inTable('categories')
    })
};

// remover novas tabelas, colunas e etc
exports.down = function(knex, Promise) {
    return knex.schema.dropTable('categories')
};
