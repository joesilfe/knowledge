const schedule = require('node-schedule')

module.exports = app => {
    // schedule.scheduleJob('[segundo] [munuto] [hora] [dia] [mes] [dai da semana]')
    // schedule.scheduleJob('[de um em um minuto] * * * *')
    schedule.scheduleJob('*/1 * * * * *', async function () {
        const usersCount = await app.db('users').count('id').first()
        const categoriesCount = await app.db('categories').count('id').first()
        const articlesCount = await app.db('articles').count('id').first()

        const { Stat } = app.api.stat

        const lastStat = await Stat.findOne({}, {},
            { sort: { 'createdAt': -1 } })

        const stat = new Stat({
            users: usersCount.count,
            categories: categoriesCount.count,
            articles: articlesCount.count,
            createdAt: new Date()
        })

        // changueUSers = [se a última estatistica não estiver setada] ou [o valor for diferente do usuário] e [o valor for diferente do antigo]
        const changueUsers = !lastStat || stat.users !== lastStat.users
        const changueCategories = !lastStat || stat.categories !== lastStat.categories
        const changueArticles = !lastStat || stat.articles !== lastStat.articles
    
        if(changueUsers || changueCategories || changueArticles){
            stat.save().then(() => console.log('\x1b[33m%s\x1b[337m', "[Stats] Estatíscticas atualizadas", '\x1b[0m'))  
        }
    })
}