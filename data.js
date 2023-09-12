const homeBtn = document.getElementById("homebtn");

window.addEventListener("load", () => {
	homeBtn.addEventListener("click", () => {
		window.location.href = "/home.html";
	});
});
