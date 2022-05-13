// referenced from https://www.aspsnippets.com/Articles/Create-dynamic-DropDownList-in-HTML-using-JavaScript.aspx
function AddDropBox(fileOption) {
	// read coursework json data
	let courseworkdata = fs.readFileSync('public/data/coursework.json');
	let coursework = JSON.parse(courseworkdata);

	// read module json data
	let moduledata = fs.readFileSync('public/data/module.json');
	let modulejson = JSON.parse(moduledata);
	
	if (fileOption == modulejson){
		parseFile = modulejson;
	}
	if (fileOption == 'cca'){
		parseFile = coursework;
	}
	
	try {
        if (req.user.id in parseFile) {
            optionsForUser = parseFile[req.user.id];
			console.log(optionsForUser);
        }
	}
    catch {
        res.redirect('/createmodule')
    }
	
	var ddl = document.createElement("SELECT");
	
	for (var i = 0; i < optionsForUser.length; i++) {
		var option = document.createElement("OPTION");

		//Set Name in Text part.
		option.innerHTML = optionsForUser[i].name;

		//Set Id in Value part.
		//option.value = optionsForUser[i].CustomerId;

		//Add the Option element to DropDownList.
		ddl.options.add(option);
	}
	document.getElementById('selectContainer').appendChild(ddl);  
}