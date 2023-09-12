const tileContainer = document.getElementById("tileContainer");
const homeBtn = document.getElementById("homebtn");
const panel1 = document.getElementById("panel1"),
	panel2 = document.getElementById("panel2"),
	panel3 = document.getElementById("panel3"),
	panel4 = document.getElementById("panel4");
const colorSchemeOcean = [
	"#00BFFF",
	"#1E90FF",
	"#87CEEB",
	"#20B2AA",
	"#48D1CC",
	"#00CED1",
	"#5F9EA0",
	"#4682B4",
	"#B0E0E6",
];
const colorSchemeNightSky = [
	"#1C1C56",
	"#2E2E99",
	"#4B0082",
	"#6A0888",
	"#8A084B",
	"#A901DB",
	"#D0A9F5",
	"#F5A9E1",
	"#FAFAD2",
];

// Determine tile size and number
const tilesAcrossWidth = 20;
const tileSize = window.innerWidth / tilesAcrossWidth;
const numRows = Math.ceil(window.innerHeight / tileSize);
const numCols = tilesAcrossWidth;

// Array to hold the previous color for each tile to ensure no two tiles touch with the same color.
let previousColors = Array(numRows)
	.fill()
	.map(() => Array(numCols).fill(""));

for (let i = 0; i < numRows; i++) {
	for (let j = 0; j < numCols; j++) {
		const tile = document.createElement("div");
		tile.classList.add("tile");
		tile.style.width = `${tileSize}px`;
		tile.style.height = `${tileSize}px`;

		let color;
		do {
			color =
				colorSchemeOcean[Math.floor(Math.random() * colorSchemeOcean.length)];
		} while (
			(i > 0 && previousColors[i - 1][j] === color) ||
			(j > 0 && previousColors[i][j - 1] === color)
		);

		previousColors[i][j] = color;
		tile.style.background = color;
		tileContainer.appendChild(tile);
	}
}

function transitionColors(currentScheme, nextScheme) {
	let newColors = Array(numRows)
		.fill()
		.map(() => Array(numCols).fill(""));

	for (let i = 0; i < numRows; i++) {
		for (let j = 0; j < numCols; j++) {
			const tile = tileContainer.children[i * numCols + j];

			let newColor;
			do {
				newColor = nextScheme[Math.floor(Math.random() * nextScheme.length)];
			} while (
				(i > 0 &&
					(tileContainer.children[(i - 1) * numCols + j].style.background ===
						newColor ||
						newColors[i - 1][j] === newColor)) ||
				(j > 0 &&
					(tileContainer.children[i * numCols + j - 1].style.background ===
						newColor ||
						newColors[i][j - 1] === newColor))
			);

			newColors[i][j] = newColor;
			tile.style.background = newColor;
		}
	}
}
function loginTransition() {
	const loginButton = document.getElementById("loginButton");
	const mainContent = document.getElementById("mainContent");

	// Fade out the login button
	loginButton.style.opacity = "0";
	loginButton.style.transition = "opacity 1s, transform 1s";
	loginButton.style.transform = "scale(0.2)";

	// After the 1-second transition, hide the button and show and fade in mainContent
	setTimeout(() => {
		loginButton.style.display = "none";

		mainContent.style.display = "flex";
		setTimeout(() => {
			mainContent.style.opacity = "1";
		}, 50); // Short delay to ensure display: block is applied before starting the opacity transition
	}, 1000);
}
let currentScheme = colorSchemeOcean;
let nextScheme = colorSchemeNightSky;
window.addEventListener("load", () => {
	setInterval(() => {
		transitionColors(currentScheme, nextScheme);

		// Swap schemes for the next transition
		[currentScheme, nextScheme] = [nextScheme, currentScheme];
	}, 4000); // every 4 seconds
	homeBtn.addEventListener("click", () => {
		window.location.href = "/home.html";
	});
	panel4.addEventListener("click", () => {
		window.location.href = "/data.html";
	});
});
