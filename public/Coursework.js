2// referenced from https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_js_rangeslider_round

var slider = document.getElementById("myRange");
slider.oninput = function() {
	var output = document.getElementById("demo");
	output.innerHTML = slider.value;
	output.innerHTML = this.value;
}