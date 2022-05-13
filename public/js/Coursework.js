2// referenced from https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_js_rangeslider_round

var slider = document.getElementById("myRange");
slider.oninput = function() {
	var output = document.getElementById("demo");
	output.innerHTML = slider.value;
	output.innerHTML = this.value;
}

function handleChange(checkbox) {
	let question = "This action will delete this coursework. Do you want to delete it?";
	if (confirm(question) == true) {
		text = "You pressed OK!";
    } else {
		document.getElementById("checkbox").checked = false;
    }
}

// referenced from https://www.aspsnippets.com/Articles/Create-dynamic-DropDownList-in-HTML-using-JavaScript.aspx
function AddDropBox(fileOption) {
	if (fileOption == 'cc'){
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