2// referenced from https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_js_rangeslider_round

var slider = document.getElementById("myRange");
slider.oninput = function() {
	var output = document.getElementById("demo");
	output.innerHTML = slider.value;
	output.innerHTML = this.value;
}

function createCoursework(){
	let text = "Are you sure you want to create this coursework?";
	if (confirm(question) == true) {
		text = " You have created the coursework";
	}
	else {
		text = " You didn't create the coursework";
		location.href = '/CourseworkVS.ejs';
    }

}
function confirmSubmit() {
	if (confirm("Are you sure you want to create the coursework? ")) {
		document.getElementById("FORM.ID").submit();

	}
	else {
		return false;
    }
}


function handleChange(checkbox) {
	let question = "This action will delete this coursework. Do you want to delete it?";
	if (confirm(question) == true) {
		text = "You pressed OK!";
    } else {
		document.getElementById("checkbox").checked = false;
    }
}