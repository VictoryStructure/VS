// server.js
//
// Referenced from https://github.com/WebDevSimplified/Nodejs-Passport-Login/blob/master/server.js

const express = require('express')
const app = express()
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const fs = require('fs')
const bcrypt = require('bcrypt')
const url = require('url');


const initializePassport = require('./passport-config')
initializePassport(
    passport,
    username => users.find(user => user.username === username),
    id => users.find(user => user.id === id)
)

app.set('view-engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended: false})) // https://stackoverflow.com/questions/23259168/what-are-express-json-and-express-urlencoded
app.use(flash())
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

// read user json data
let rawdata = fs.readFileSync('public/data/users.json');
let users = JSON.parse(rawdata);

// read coursework json data
let courseworkdata = fs.readFileSync('public/data/coursework.json');
let coursework = JSON.parse(courseworkdata);

// read module json data
let moduledata = fs.readFileSync('public/data/module.json');
let modulejson = JSON.parse(moduledata);

app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', { name: req.user.username })
})

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('Register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        })
        
        // write data to json file
        let data = JSON.stringify(users, undefined, 4)
        fs.writeFileSync('public/data/users.json', data)

        res.redirect('/login')
    } 
    catch {
        res.redirect('/register')
    }
})

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('LoginVS.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

app.get('/module', checkAuthenticated, (req, res) => {
    res.render('Module.ejs', {passedid: req.user.id, module_json: modulejson})
})

app.get('/allcourseworks', checkAuthenticated, (req, res) => {
    res.render('CourseworkVS.ejs', { passedid: req.user.id, coursework_json: coursework, module_json: modulejson })
})

app.get('/createcoursework', checkAuthenticated, (req, res) => {
    res.render('CreateCourseworkVS.ejs', { passedid: req.user.id, module_json: modulejson })
})

app.get('/createmodule', checkAuthenticated, (req, res) => {
	res.render('CreateModule.ejs');
})
app.get('/about', checkAuthenticated, (req, res) => { 
	res.render('About.ejs', {passedid: req.user.id, coursework_json: coursework, module_json: modulejson})
})

app.post('/createcoursework', checkAuthenticated, (req, res) => {
    try {
        if (req.user.id in coursework) {
            coursework[req.user.id].push({
                courseworkname : req.body.courseworkname,
                description : req.body.description,
                deadline : req.body.deadline,
                markvalue : req.body.markvalue,
                notes : req.body.notes,
                percentage : 0,
				modulename : req.body.modulename
            })
        }
        else {
            coursework[req.user.id] = [{
                courseworkname : req.body.courseworkname,
                description : req.body.description,
                deadline : req.body.deadline,
                markvalue : req.body.markvalue,
                notes : req.body.notes,
                percentage : 0,
				modulename : req.body.modulename
            }]
        }
        
        // write data to json file
        let data = JSON.stringify(coursework, undefined, 4)
        fs.writeFileSync('public/data/coursework.json', data)

        res.redirect('/allcourseworks')
    } 
    catch {
        res.redirect('/createcoursework')
    }
})

app.post('/createmodule', checkAuthenticated, (req, res) => {
    try {
        if (req.user.id in modulejson) {
            modulejson[req.user.id].push({
                modulename : req.body.modulename,
                description : req.body.description
            })
        }
        else {
            modulejson[req.user.id] = [{
                modulename : req.body.modulename,
                description : req.body.description
            }]
        }
        // write data to json file
        let data1 = JSON.stringify(modulejson, undefined, 4)
        fs.writeFileSync('public/data/module.json', data1)

        res.redirect('/module')
    } 
    catch {
        res.redirect('/createmodule')
    }
})

app.get('/deletecoursework', checkAuthenticated, (req, res) => {
    try {
		let userID = req.user.id
		let searchURL = url.parse(req.url,true).search
		
		console.log(userID)
		console.log(coursework[userID])
		console.log(searchURL)
		searchURL = searchURL.replace('?', '')
		console.log(searchURL,'\n')
		searchURL = searchURL.split('%20').join(' ')
		console.log(searchURL,'\n')

		coursework[userID].forEach(function (obj, index) { 
			if ((obj.courseworkname) == (searchURL)){
				console.log(obj.courseworkname, ' == ' ,searchURL)
				console.log('yes at ', index)
				var deletedItem = coursework[userID].splice(index,1);
			}
			else{ 
				console.log(obj.courseworkname, ' == ' ,searchURL)
				console.log('no')
			}
			
			console.log(coursework[userID],'\n')
			console.log(coursework)
			
			let data = JSON.stringify(coursework, undefined, 4)
			fs.writeFileSync('public/data/coursework.json', data)
		})
		

        res.redirect('/allcourseworks')
    } 
    catch {
        res.redirect('/allcourseworks')
    }
})

app.post('/allcourseworks', checkAuthenticated, (req, res) => {
	let selectedpage = req.body.selectpage
	console.log(selectedpage)
    res.render('CourseworkSpecific.ejs', { selectedpage: selectedpage, passedid: req.user.id, coursework_json: coursework, module_json: modulejson,  })
})

app.get('/calendar', checkAuthenticated, (req, res) => {
    res.render('Calendar.ejs');
})

app.get('/createactivity', checkAuthenticated, (req, res) => {
    res.render('CreateCourseworkActivity.ejs', { passedid: req.user.id, coursework_json: coursework, module_json: modulejson })
})
  
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

app.listen(3000)