//variables
const homeBtn = document.getElementById("homebtn");
const totalData = 2;
let curData = 1;
const neonColors = [
	"#FF00FF", // Neon Pink
	"#00FF00", // Neon Green
	"#FFD700", // Gold
	"#1E90FF", // DodgerBlue
	"#FF4500", // OrangeRed
	"#00FFFF", // Aqua
	"#9400D3", // DarkViolet
	"#FF1493", // DeepPink
	"#FFFF00", // Yellow
];
const darkNeonColors = [
	"#880088", // Darker Neon Pink
	"#008800", // Darker Neon Green
	"#886500", // Darker Gold
	"#104C80", // Darker DodgerBlue
	"#882200", // Darker OrangeRed
	"#008888", // Darker Aqua
	"#510073", // Darker DarkViolet
	"#880A51", // Darker DeepPink
	"#888800", // Darker Yellow
];
const galaxyColors = [
	"#0B3D91", // Deep blue
	"#120A8F", // Ultramarine blue
	"#4B0082", // Indigo
	"#483D8B", // Dark slate blue
	"#2F4F4F", // Dark slate gray
	"#1C1C1C", // Very dark gray (almost black)
	"#800080", // Purple
	"#2E0854", // Dark violet
	"#3C1414", // Dark brownish-red (representing deep space red)
];

//event listeners
window.addEventListener("load", () => {
	homeBtn.addEventListener("click", () => {
		window.location.href = "/home.html";
	});
});

//functions

function createDataRow() {
	// Create a new row element
	const newRow = document.createElement("div");
	newRow.classList.add("row");

	// Loop to generate 15 blocks with placeholders
	for (let i = 0; i <= 15; i++) {
		const block = document.createElement("div");
		block.classList.add("block");
		switch (i) {
			case 0:
				block.innerText = curData.toString();
				curData++;
				break;
			default:
				block.innerText = i.toString();
		}

		newRow.appendChild(block);
	}

	// Append the new row to the main container
	const mainContainer = document.getElementById("datamaincontainer");
	mainContainer.appendChild(newRow);
}
function createHeaderRow() {
	const headers = [
		"#",
		"Name",
		"Date",
		"Site",
		"Tide",
		"Weather",
		"Water Surface",
		"Wind Speed",
		"Wind Direction",
		"Rainfall",
		"Water Depth",
		"Sample Distance",
		"Air Temperature",
		"Water Temperature",
		"Secci Depth",
		"Comments",
	];

	// Create a new row element for the header
	const headerRow = document.createElement("div");
	headerRow.classList.add("row", "sticky-header");

	// Loop to generate blocks for headers
	for (let i = 0; i < headers.length; i++) {
		const block = document.createElement("div");
		block.classList.add("headblock");
		block.innerText = headers[i];
		headerRow.appendChild(block);
	}

	// Append the header row to the main container
	const mainContainer = document.getElementById("datamaincontainer");
	mainContainer.appendChild(headerRow);
}
function setRandomBackColor(element) {
	const randomColor =
		galaxyColors[Math.floor(Math.random() * neonColors.length)];
	element.style.backgroundColor = randomColor;
}

//onLoad

window.addEventListener("load", () => {
	setInterval(() => {
		setRandomBackColor(document.body);
	}, 10000);
});
// Call the functions
createHeaderRow();
for (let i = 0; i < 20; i++) {
	createDataRow();
}
