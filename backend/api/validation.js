module.exports = app => {
    // existe
    function existsOrError(value, msg) {
        // Verificando se o valor existe, se não existir retorna um erro
        if(!value) throw msg

        // Verificando se o valor é um array vazio
        if(Array.isArray(value) && value.length === 0) throw msg

        // Se o valor for do tipo string, então verifico se a mesma está vazia [!value.trim()]
        if (typeof value === 'string' && !value.trim() ) throw msg
    }
    // Não existe
    function notExistsOrError(value, msg) {
        try{
            // existe algum erro?
            existsOrError(value, msg)
        } catch (msg){
            return
        }
        throw msg
    }

    // é igual
    function equalsOrError(valueA, valueB, msg) {
        if(valueA !== valueB) throw msg
    }

    return {existsOrError, notExistsOrError, equalsOrError}
}