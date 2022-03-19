const express = require('express')
const app = express()
const bcrypt = require('bcrypt')

// const users = [{
//     name: 'John Doe',
//     email: 'john.doe@uea.ac.uk',
//     password: 'john'
// }]

app.set('view-engine', 'ejs')
app.use(express.static('public'))

// https://stackoverflow.com/questions/23259168/what-are-express-json-and-express-urlencoded
app.use(express.urlencoded({extended: false}))

app.get('/login', (req, res) => {
    res.render('LoginVS.ejs')
})

app.post('/login', (req, res) => {
    // req.body.email -> email corresponds to name field in ejs form
})

app.listen(3000)