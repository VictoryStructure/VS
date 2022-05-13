
function confirmSubmit() {
	var text;
	var r = confirm("Are you sure you want to create the Module? ");
	if (r == true) {
		alert("Module created");

	} else {
		alert("Cancelled Module");
		event.preventDefault();
	}
}
