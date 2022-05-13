
function confirmSubmit() {
	var text;
	var r = confirm("Are you sure you want to create the coursework? ");
	if (r == true) {
		alert("Coursework Created");

	} else {
		alert("Cancelled coursework");
		event.preventDefault();
	}
	console.log(text);
}
