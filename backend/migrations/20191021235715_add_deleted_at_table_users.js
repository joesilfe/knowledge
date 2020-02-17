
exports.up = function (knex, Promise) {
    return knex.schema.alterTable('users', table => {
        //timestamp() : cria um campo que tem data, hora, minuto, segundo, dia, mês e ano
        table.timestamp('deletedAt')       
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.alterTable('users', table => {
        // dropColumn() : excluindo coluna
        table.dropColumn('deletedAt')
    })
};
