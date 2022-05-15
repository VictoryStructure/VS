// server.js
//
// Referenced from https://github.com/WebDevSimplified/Nodejs-Passport-Login/blob/master/server.js


// Initialization
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

// read activity json data
let activitydata = fs.readFileSync('public/data/activity.json');
let activityjson = JSON.parse(activitydata);


/****** Index - Home Page ******/

app.get('/', checkAuthenticated, (req, res) => {
	let userID = req.user.id
	new_coursedeadline = []
	coursedeadline = []
	var times = 3
	var temp = 0
	coursework[userID].forEach(function (obj, index) { 				//for each coursework the user has saved
		temp = obj.deadline											//saves the current indexs deadline
		new_coursedeadline.push(temp)								//adds the saved deadline to the array
	})
	new_coursedeadline.sort()										//sorts the array
	new_coursedeadline = new_coursedeadline.slice(0,3)				//takes the 3 earliest dates

	new_coursedeadline.forEach(function (obj1, index1) { 			//for each date in the array
		coursework[userID].forEach(function (obj2, index2) { 		//search the modules for the user
			if ((obj2.deadline) == (obj1)){							//check the date array against the module deadline
				coursedeadline.push(obj2)							//if they match, add the module to the array
			}
		})
	})
    res.render('index.ejs', { name: req.user.username, urgent: coursedeadline, passedid: req.user.id})
})

/****** Register Endpoints ******/

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('Register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)		//
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

/****** Login/Logout Endpoints ******/

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('Login.ejs')
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

/****** About / Settings Endpoints ******/

app.get('/about', checkAuthenticated, (req, res) => { 
	res.render('About.ejs', {passedid: req.user.id, coursework_json: coursework, module_json: modulejson})
})

app.get('/settings', checkAuthenticated, (req, res) => {
	res.render('AccountSettings.ejs', { name: req.user.username, email: req.user.email, error: false})
})

app.post('/changepassword', checkAuthenticated, async (req, res) => {
    if (await bcrypt.compare(req.body.oldPassword, req.user.password)) {			//

        if (req.body.newPassword == req.body.confirmPassword) {						//
            const hashedPassword = await bcrypt.hash(req.body.newPassword, 10)		//
            req.user.password = hashedPassword										//
	
            users.forEach(function (obj, index) { 									//
                if (obj.id == req.user.id){											//
                    obj.password = hashedPassword									//
                }
            })

            let data = JSON.stringify(users, undefined, 4)
            fs.writeFileSync('public/data/users.json', data)

            res.redirect('/')
        }

        else {
            let error_message = "New passwords don't match"
            res.render('AccountSettings.ejs', { name: req.user.username, email: req.user.email, error: error_message})
        }
    } 

    else {
        let error_message = "Old password incorrect"
        res.render('AccountSettings.ejs', { name: req.user.username, email: req.user.email, error: error_message})
    }
})

/****** Module Endpoints ******/

app.get('/module', checkAuthenticated, (req, res) => {
    res.render('Module.ejs', {passedid: req.user.id, module_json: modulejson})
})

app.get('/createmodule', checkAuthenticated, (req, res) => {
	res.render('CreateModule.ejs');
})

app.post('/createmodule', checkAuthenticated, (req, res) => {   //This is handeling a post request
    try {														
        if (req.user.id in modulejson) {						//if the user already has modules saved
            modulejson[req.user.id].push({						//add the module to the users JSON
                modulename : req.body.modulename,				
                description : req.body.description				
            })
        }
        else {
            modulejson[req.user.id] = [{						//if the user doesnt have any modules saved, make them a JSON
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

app.get('/deletemodule', checkAuthenticated, (req, res) => {
    let userID = req.user.id										
    let searchURL = url.parse(req.url,true).search					//get the search
    
    searchURL = searchURL.replace('?', '')							//
    searchURL = searchURL.split('%20').join(' ')					//

    if (searchURL) {												//
        modulejson[userID].forEach(function (obj, index) { 			//
        	if ((obj.modulename) == (searchURL)){					//
        		modulejson[userID].splice(index , 1)				//
        	}
        })

        let module_data = JSON.stringify(modulejson, undefined, 4)	//
        fs.writeFileSync('public/data/module.json', module_data)	//

        new_coursework = []		
        coursework[userID].forEach(function (obj, index) { 			//
        	if ((obj.modulename) != (searchURL)){					//
                new_coursework.push(obj)							//
        	}
        })

        coursework[userID] = new_coursework							//
        let data = JSON.stringify(coursework, undefined, 4)
        fs.writeFileSync('public/data/coursework.json', data)
        
        res.redirect('/module')
    }

    else {
        res.render('DeleteModule.ejs', { passedid: req.user.id, module_json: modulejson })
    }
})

/****** Coursework Endpoints ******/

app.get('/allcoursework', checkAuthenticated, (req, res) => {
    res.render('Coursework.ejs', { passedid: req.user.id, coursework_json: coursework, module_json: modulejson })
})

app.post('/allcoursework', checkAuthenticated, (req, res) => {
	let selectedpage = req.body.selectpage
	let userID = req.user.id
	new_activity = []
	activityjson[userID].forEach(function (obj, index) { 
		if ((obj.courseworkname) == (selectedpage)){
			new_activity.push(obj)
		}
	})

    let percent = 0
    coursework[userID].forEach(function (obj, index) { 
		if ((obj.courseworkname) == (selectedpage)){
			percent = obj.percentage
		}
	})
	
    res.render('CourseworkSpecific.ejs', { selectedpage: selectedpage, passedid: req.user.id, coursework_json: coursework, module_json: modulejson, activity: new_activity, percentage: percent})
})

app.get('/createcoursework', checkAuthenticated, (req, res) => {
    res.render('CreateCoursework.ejs', { passedid: req.user.id, module_json: modulejson })
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

        res.redirect('/allcoursework')
    } 
    catch {
        res.redirect('/createcoursework')
    }
})

app.get('/deletecoursework', checkAuthenticated, (req, res) => {
    try {
		let userID = req.user.id
		let searchURL = url.parse(req.url,true).search
		
		searchURL = searchURL.replace('?', '')
		searchURL = searchURL.split('%20').join(' ')

		coursework[userID].forEach(function (obj, index) { 
			if ((obj.courseworkname) == (searchURL)){
				coursework[userID].splice(index,1)
			}
			
			let data = JSON.stringify(coursework, undefined, 4)
			fs.writeFileSync('public/data/coursework.json', data)
		})
		
        res.redirect('/allcoursework')
    } 
    catch {
        res.redirect('/allcoursework')
    }
})

app.post('/changeslider', checkAuthenticated, (req, res) => {
	let userID = req.user.id
	var value = req.body.value
	var coursename = req.body.coursename

	coursework[userID].forEach(function (obj, index) { 
		if (obj.courseworkname == coursename){
			obj.percentage = value
		}
	})

	// write data to json file
	let data = JSON.stringify(coursework, undefined, 4)
	fs.writeFileSync('public/data/coursework.json', data)
})

/****** Coursework Activity ******/

app.get('/createactivity', checkAuthenticated, (req, res) => {
    res.render('CreateCourseworkActivity.ejs', { passedid: req.user.id, coursework_json: coursework, module_json: modulejson, activity_json: activityjson})
})

app.post('/createactivity', checkAuthenticated, (req, res) => {
    try {
        if (req.user.id in activityjson) {
            activityjson[req.user.id].push({
                activityname : req.body.activityname,
                description : req.body.description,
                notes : req.body.notes,
				courseworkname : req.body.courseworkname
            })
        }
        else {
            activityjson[req.user.id] = [{
                courseworkname : req.body.courseworkname,
                activityname : req.body.activityname,
                description : req.body.description,
                notes : req.body.notes,
				courseworkname : req.body.courseworkname
            }]
        }
        
        // write data to json file
        let data = JSON.stringify(activityjson, undefined, 4)
        fs.writeFileSync('public/data/activity.json', data)

        res.redirect('/allcoursework')
    } 
    catch {
        res.redirect('/allcoursework')
    }
})

/****** Calendar ******/

app.get('/calendar', checkAuthenticated, (req, res) => {
    res.render('Calendar.ejs')
})


/****** Helper Functions ******/
  
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

// Listen on port 3000
app.listen(3000)