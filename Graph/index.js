// Query
let homeBtn = document.getElementById("graphhomebtn");
// Varriables
let allDropsSelected = false;
//0-Tide/... | 1-site | 2-Time | 3-Value
let dropDowns = [false, false, false, false];
let curTimeSpan = " ";
//functions
function updateSelectionsContainer(selectionsList, menu, preStr, boolindex) {
	const container = document.querySelector(".selectMenu");
	container.innerHTML = "";
	const numSelections = selectionsList.length;
	const sqrt = Math.sqrt(numSelections);
	const numRows = Math.round(sqrt);
	let numColumns = Math.ceil(numSelections / numRows);

	// Set grid template rows and columns
	container.style.gridTemplateRows = `repeat(${numRows}, 1fr)`;
	container.style.gridTemplateColumns = `repeat(${numColumns}, 1fr)`;
	let selIndex = 0;
	selectionsList.forEach((selectionText) => {
		const SEL_INDEX = selIndex;
		const selection = document.createElement("div");
		selection.className = "selections";
		selection.textContent = String(selectionText);
		const selectIcon = document.createElement("div");
		selectIcon.className = "dropMenuIcon";
		selection.addEventListener("click", function () {
			container.style.left = "-100%";
			container.style.opacity = "0%";
			menu.textContent = preStr + String(selectionText);
			menu.appendChild(selectIcon);
			let testInd = 3;
			let listStr = [" "];
			let selectSwitchStr;
			// Checks to see if the option selected is actually changing the time frame, if it is
			// it will change what timeframe we are looking at, else it will just select the current
			// timeframe to use for the graph
			if (
				(curTimeSpan == " " ||
					curTimeSpan == "Weekly" ||
					curTimeSpan == "Monthly" ||
					curTimeSpan == "Yearly") &&
				(selectionText == "Weekly" ||
					selectionText == "Monthly" ||
					selectionText == "Yearly")
			) {
				selectSwitchStr = selectionText;
			} else {
				selectSwitchStr = curTimeSpan;
			}
			console.log(selectSwitchStr);
			switch (selectSwitchStr) {
				case "Weekly":
					curTimeSpan = "Weekly";
					testInd = 0;
					listStr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
					break;
				case "Monthly":
					curTimeSpan = "Monthly";
					testInd = 1;
					listStr = ["1-7", "8-14", "15-22", "23+"];
					break;
				case "Yearly":
					curTimeSpan = "Yearly";
					testInd = 2;
					listStr = [
						"Jan",
						"Feb",
						"Mar",
						"Apr",
						"May",
						"Jun",
						"Jul",
						"Aug",
						"Sep",
						"Oct",
						"Nov",
						"Dec",
					];
					break;
				default:
					break;
			}
			myDataSet = [
				[10, 30, 20, 20, 10, 40, 10],
				[7, 4, 12, 1],
				[2, 6, 8, 2, 12, 10, 2, 2, 6, 8, 4, 4],
				[5, 10, 15],
			];
			dropDowns[boolindex] = true;
			checkAllDropdownsSelected();
			if (allDropsSelected == true)
				plotSelectedGraph(myDataSet, testInd, listStr);
		});
		container.appendChild(selection);
		selIndex++;
	});

	container.style.left = "0";
}
function checkAllDropdownsSelected() {
	console.log(dropDowns);
	for (const isSelected of dropDowns) {
		if (!isSelected) {
			return; // if any dropdown is not selected, exit the function early
		}
	}
	// If the function hasn’t returned by this point, all dropdowns are selected
	allDropsSelected = true;
}

function processDropdownMenus() {
	// Array of the ids of the dropdown menus in the order you want them to appear in the string
	const dropdownIds = ["sitesMenu", "valuesMenu", "rainFallMenu", "datesMenu"];

	// Initialize an array to hold the processed strings from each dropdown
	let resultArray = [];

	// Loop over each dropdown id
	for (const id of dropdownIds) {
		// Get the dropdown menu by id
		const dropdownMenu = document.getElementById(id);

		// If dropdown menu exists, get its text content
		if (dropdownMenu) {
			let text = dropdownMenu.textContent || dropdownMenu.innerText;

			// If the text contains a space, split the string and keep everything after the first space
			if (text.includes(" ")) {
				text = text.split(" ").slice(1).join(" ");
			}
			if (id == "rainFallMenu") {
				text = text + ": ";
			}
			// Push the processed text into the array
			resultArray.push(text);
		}
	}

	// Join the processed strings with a space and return the resulting string
	return resultArray.join(" ");
}
function getCurrentDate() {
	const currentDate = new Date(); // Get current date object
	const day = currentDate.getDate(); // Get current day
	const month = currentDate.getMonth() + 1; // Get current month (0 indexed, so +1)
	const year = currentDate.getFullYear(); // Get current year

	return `${month}-${day}-${year}`; // Return as a list
}
function cumulativeMovingAverage(array) {
	let sum = 0;
	return array.map((value, index) => {
		sum += value;
		return sum / (index + 1);
	});
}
function plotSelectedGraph(lists, index, listStr) {
	if (index < 0 || index >= lists.length) {
		console.error("Invalid index provided:", index);
		return;
	}

	const selectedList = lists[index];
	if (!Array.isArray(selectedList)) {
		console.error("No list found at index:", index);
		return;
	}

	plotGraphWithAverage(selectedList, listStr, processDropdownMenus());
}

function plotGraphWithAverage(dataset, plotStrList, labelStr) {
	// Get the container and create a canvas element
	const container = document.getElementById("innergraph");
	const canvas = document.createElement("canvas");
	container.innerHTML = ""; // Clear any existing children
	container.appendChild(canvas);
	// Get the 2D context of the canvas
	const ctx = canvas.getContext("2d");

	// Calculate cumulative moving average curve
	const averageCurve = cumulativeMovingAverage(dataset);

	// Create chart
	new Chart(ctx, {
		type: "line",
		data: {
			labels: dataset.map((_, index) => plotStrList[index]),
			datasets: [
				{
					label: "Original Data",
					data: dataset,
					borderColor: "rgb(75, 192, 192)",
					tension: 0.1,
					fill: false,
				},
				{
					label: "Average Curve",
					data: averageCurve,
					borderColor: "rgb(255, 99, 132)",
					tension: 0.5,
					fill: false,
				},
			],
		},
		options: {
			plugins: {
				legend: {
					labels: {
						color: "black",
					},
				},
				title: {
					display: true,
					text: `${processDropdownMenus()}`,
					font: {
						size: 16,
					},
					color: "black",
				},
			},
			scales: {
				x: {
					beginAtZero: true,
					grid: {
						color: "#757575", // Set grid line color
					},
					ticks: {
						color: "black", // Set label color
					},
					title: {
						display: true,
						text: "-Time Frame-",
						font: {
							size: 16,
						},
						color: "black",
					},
				},
				y: {
					beginAtZero: true,
					grid: {
						color: "#757575", // Set grid line color
					},
					ticks: {
						color: "black", // Set label color
					},
					title: {
						display: true,
						text: "-Unit-",
						font: {
							size: 16,
						},
						color: "black",
					},
				},
			},
		},
	});
}

function setUpHomeBtn() {
	homeBtn.addEventListener("click", () => {
		if(isUserLoggedIn()){
		console.log("is logged in.");
		document.location.href = "/menu.html";
		}else{
		console.log("is not logged in.");
		document.location.href = "/home.html";
		}
	});
}
document.addEventListener("DOMContentLoaded", () => {
	const selectMenu = document.querySelector(".selectMenu");
	const dropDownMenus = document.querySelectorAll(".dropDownMenu");

	setUpHomeBtn();
	dropDownMenus.forEach((menu) => {
		menu.addEventListener("click", function () {
			if (selectMenu.style.left === "0%") {
				selectMenu.style.left = "-100%";
				selectMenu.style.opacity = "0%";
				return; // return early if we are hiding the menu
			}

			let myList;
			// Do something different depending on which dropdown is clicked
			switch (menu.id) {
				case "rainFallMenu":
					myList = [
						"Tide",
						"Water",
						"Weather",
						"Wind Speed",
						"Wind Direction",
						"Rain",
						"Water Depth",
						"Sample Distance",
						"Air Temperature",
						"Water Temperature",
						"Secchi Depth",
					];
					updateSelectionsContainer(myList, menu, "", 0);
					break;

				case "sitesMenu":
					myList = [
						"AMPH",
						"BRRI",
						"CIEA",
						"CMPO",
						"DNPA",
						"EBDO",
						"JOPO",
						"LEPO",
						"LOCO",
						"MIPO",
						"MMPO",
						"MTVE",
						"NITH",
						"NWWI",
						"PAPO",
						"PEPO",
						"PIWH",
						"RIWH",
						"RKPO",
						"SCPO",
						"SHPT",
						"TTPO",
						"WHVN",
						"WIKA",
						"YACL",
					];
					updateSelectionsContainer(myList, menu, "Site: ", 1);
					break;

				case "datesMenu":
					// you might want to populate myList appropriately
					myList = ["Weekly", "Monthly", "Yearly", "Select Range"];
					updateSelectionsContainer(myList, menu, "Time: ", 2);
					break;

				case "valuesMenu":
					// you might want to populate myList appropriately
					myList = ["Mean", "Median", "Max", "Min"];
					updateSelectionsContainer(myList, menu, "Value: ", 3);
					break;

				default:
					console.error("Unknown menu clicked:", menu.id);
			}

			// Open the menu after updating the content
			selectMenu.style.left = "0%";
			selectMenu.style.opacity = "100%";
		});
	});
});
