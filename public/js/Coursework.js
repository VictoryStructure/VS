2// referenced from https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_js_rangeslider_round
// https://stackoverflow.com/questions/1140402/how-to-add-jquery-in-js-file

function confirmSubmit() {
	var ask = window.confirm("Are you sure you want to delete this post?");
    if (ask) {
        window.alert("This post was successfully deleted.");

        window.location.href = "window-location.html";
    }
	let confirmSubmit = confirm("Are you sure you want to create the coursework? ");
	if (confirmSubmit) {
		alert("Coursework Created");

	} else {
		alert("Coursework not created");
    } 
}


