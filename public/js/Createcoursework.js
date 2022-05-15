function confirmSubmit() {
    var r = confirm("Do you want to create this coursework")
    if (r == true) {
        alert("Coursework Created");

    } else {
        alert("Coursework not created");
        event.preventDefault();
    }
}



