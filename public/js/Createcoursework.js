function confirmSubmit() {
    if (confirm("Do you want to create this coursework")) {
        alert("Coursework Created");

    } else {
        alert("Coursework not created");
        event.preventDefault();
    }
}