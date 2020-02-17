const app = require('express')()
const consign = require('consign')
const dbKenx = require('./config/db')
const mongoose = require('mongoose')
require('./config/mongodb')

// com app.db é possível agora fazer selects diretamente utilizando [app.db]
app.db = dbKenx
app.mongoose = mongoose

// consign passa como parametro a variável [app] para o [middlewares.js] encadeado no then()
consign()    
    .then('./config/passport.js')
    .then('./config/middlewares.js')
    .then('./api/validation.js')
    .then('./api')
    .then('./schedule')
    .then('./config/routes.js')
    .into(app)

app.listen(3000, ()=> {
    console.log('backend executando')
})
