// Your Firebase configuration (initialize it here)
const firebaseConfig = {
	apiKey: "AIzaSyD1n52beNmzhLyqtv29Exw8CIEzde40LOo",
	authDomain: "creekwatchers-88ce2.firebaseapp.com",
	databaseURL: "https://creekwatchers-88ce2-default-rtdb.firebaseio.com",
	projectId: "creekwatchers-88ce2",
	storageBucket: "creekwatchers-88ce2.appspot.com",
	messagingSenderId: "799020915481",
	appId: "1:799020915481:web:e0ac620892635e99760388",
};

// Initialize Firebasee
firebase.initializeApp(firebaseConfig);

// Reference to the Firestore database
const db = firebase.firestore();
const userDataCollection = db.collection("UserData");
// Query
let homeBtn = document.getElementById("graphhomebtn");
const confirmBtn = document.getElementById("confirmBtn");
// Varriables
let allDropsSelected = false;

const timeframeDropdown = document.getElementById("datesMenu");
let selectedMeasurement,
	selectedSite,
	selectedWeek,
	selectedMonth,
	selectedYear;
let databaseData = [],
	filteredDatabaseData = [];
queryData();

//0-Tide/... | 1-site | 2-Time | 3-Value
let dropDowns = [false, false, false, false];
let curTimeSpan = " ";
//functions
function queryData() {
	userDataCollection
		.get()
		.then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				// Push each document's data into the array
				databaseData.push(doc.data());
			});
		})
		.catch((error) => {
			console.log("Error getting documents: ", error);
		});
}

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
			if (boolindex == 0) selectedMeasurement = selectionText;
			if (boolindex == 1) selectedSite = selectionText;
			menu.appendChild(selectIcon);
			let listStr = [" "];
			let selectSwitchStr;
			// Checks to see if the option selected is actually changing the time frame, if it is
			// it will change what timeframe we are looking at, else it will just select the current
			// timeframe to use for the graph
			if (
				(curTimeSpan == " " ||
					curTimeSpan == "Monthly" ||
					curTimeSpan == "Yearly") &&
				(selectionText == "Monthly" || selectionText == "Yearly")
			) {
				selectSwitchStr = selectionText;
			} else {
				selectSwitchStr = curTimeSpan;
			}
			switch (selectSwitchStr) {
				// case "Weekly":
				// 	curTimeSpan = "Weekly";
				// 	testInd = 0;
				// 	listStr = ["Day ", "Day ", "Day ", "Day ", "Day ", "Day ", "Day "];
				// 	break;
				case "Monthly":
					curTimeSpan = "Monthly";
					testInd = 1;
					listStr = ["Days 1-7", "Days 8-14", "Days 15-22", "Days 23+"];
					break;
				case "Yearly":
					curTimeSpan = "Yearly";
					testInd = 2;
					listStr = [
						"Mar",
						"Apr",
						"May",
						"Jun",
						"Jul",
						"Aug",
						"Sep",
						"Oct",
						"Nov",
					];
					break;
				default:
					break;
			}
			// Call the new function to show the popup based on the timeframe
			if (
				// selectionText === "Weekly" ||
				selectionText === "Monthly" ||
				selectionText === "Yearly"
			) {
				showPopupForTimeframe(selectionText);
			}
			dropDowns[boolindex] = true;
			checkAllDropdownsSelected();
			// Re-plot the graph with the new selections
			if (allDropsSelected == true) {
				plotSelectedGraph(databaseData, determineTestIndex(), listStr);
			}
		});
		container.appendChild(selection);
		selIndex++;
	});

	container.style.left = "0";
}

// New function to handle the display of the popup based on the selection
function showPopupForTimeframe(timeframe) {
	const popup = document.getElementById("popupWindow");
	const weekDropdown = document.getElementById("weekDropdown").parentElement;
	const monthDropdown = document.getElementById("monthDropdown").parentElement;
	const yearDropdown = document.getElementById("yearDropdown").parentElement;

	// Show the appropriate dropdowns based on the timeframe
	// if (timeframe === "Weekly") {
	// 	weekDropdown.style.display = "block";
	// 	monthDropdown.style.display = "block";
	// 	yearDropdown.style.display = "block";
	// } else
	if (timeframe === "Monthly") {
		weekDropdown.style.display = "none"; // Hide week if monthly is selected
		monthDropdown.style.display = "block";
		yearDropdown.style.display = "block";
	} else if (timeframe === "Yearly") {
		weekDropdown.style.display = "none"; // Hide week and month if yearly is selected
		monthDropdown.style.display = "none";
		yearDropdown.style.display = "block";
	}

	// Display the popup
	popup.style.display = "block";
}
// Event listener for the close button of the popup
document.querySelector(".close-btn").addEventListener("click", closePopup);

function closePopup() {
	document.getElementById("popupWindow").style.display = "none";
	// Reset the dropdown selections when the popup is closed
	document.getElementById("weekDropdown").selectedIndex = 0;
	document.getElementById("monthDropdown").selectedIndex = 0;
	document.getElementById("yearDropdown").selectedIndex = 0;
}
function determineTestIndex() {
	// Determine the index based on curTimeSpan
	switch (curTimeSpan) {
		// case "Weekly":
		// 	return 0;
		case "Monthly":
			return 0;
		case "Yearly":
			return 1;
		default:
			return -1; // Default or error case
	}
}
function getDatabaseFieldName(selectedMeasurement) {
	// Mapping of menu items to database field names
	const measurementMapping = {
		"Water Depth": "waterDepth",
		"Sample Distance": "sampleDist",
		"Air Temperature": "airTempAvg",
		"Water Temperature": "waterTempAvg",
		"Secchi Depth": "secchiAvg",
	};

	// Return the corresponding database field name
	return measurementMapping[selectedMeasurement] || null;
}

function updateListStrForGraph() {
	// Ensure selectedMonth is converted to month number correctly
	const monthNames = [
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
	];
	const monthNumber = monthNames.indexOf(selectedMonth) + 1; // Month number (1-12)
	const daysInMonth = getDaysInMonth(monthNumber, selectedYear);

	// if (curTimeSpan === "Weekly") {
	// 	let startDay = selectedWeek * 7 + 1;
	// 	let endDay = startDay + 6;

	// 	// Adjust the endDay for the last week of the month
	// 	if (selectedWeek === 3) {
	// 		// If it's the "Days 23+" selection
	// 		startDay = 23;
	// 		endDay = daysInMonth; // Use the actual number of days in the month
	// 	}

	// 	listStr = [];
	// 	for (let day = startDay; day <= endDay; day++) {
	// 		listStr.push("Day " + day);
	// 	}
	// } else
	if (curTimeSpan === "Monthly") {
		// If the selection is monthly, adjust listStr accordingly
		// This can be left as is, or modified if needed
		listStr = ["Days 1-7", "Days 8-14", "Days 15-22", "Days 23+"];
	} else if (curTimeSpan === "Yearly") {
		// If the selection is yearly, adjust listStr accordingly
		// This can be left as is, or modified if needed
		listStr = monthNames;
	}
}

confirmBtn.addEventListener("click", () => {
	// Update selections based on the current time span
	// if (curTimeSpan === "Weekly") {
	// 	selectedWeek = document.getElementById("weekDropdown").selectedIndex;
	// 	selectedMonth = document.getElementById("monthDropdown").value;
	// 	selectedYear = document.getElementById("yearDropdown").value;
	// } else
	if (curTimeSpan === "Monthly") {
		selectedWeek = null; // Reset week if not in weekly mode
		selectedMonth = document.getElementById("monthDropdown").value;
		selectedYear = parseInt(document.getElementById("yearDropdown").value, 10);
	} else {
		// Yearly or other modes
		selectedWeek = null;
		selectedMonth = null;
		selectedYear = parseInt(document.getElementById("yearDropdown").value, 10);
	}

	// Update listStr based on selectedWeek and selectedMonth
	updateListStrForGraph();
	// Re-plot the graph with the new selections
	if (allDropsSelected == true) {
		plotSelectedGraph(databaseData, determineTestIndex(), listStr);
	}

	// Close the popup after updating the graph
	closePopup();
});
// Function to populate month and year dropdowns
function populateMonthYearDropdowns() {
	const monthDropdown = document.getElementById("monthDropdown");
	const yearDropdown = document.getElementById("yearDropdown");

	// Populate month dropdown
	const months = [
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
	];
	monthDropdown.innerHTML = months
		.map((month) => `<option value="${month}">${month}</option>`)
		.join("");

	// Populate year dropdown
	const currentYear = new Date().getFullYear();
	for (let year = 2022; year <= currentYear; year++) {
		yearDropdown.innerHTML += `<option value="${year}">${year}</option>`;
	}
}
// Event listener for closing the popup
document.querySelector(".close-btn").addEventListener("click", closePopup);

// Function to handle the 'Weekly' selection
// function handleWeeklySelection() {
// 	// Show the popup when 'Weekly' is selected
// 	showPopup();
// }

// Add event listener to your existing timeframe dropdown

// timeframeDropdown.addEventListener("change", function () {
// 	if (this.value === "Weekly") {
// 		handleWeeklySelection();
// 	}
// });

// Function to store the selected values in variables
function storeSelections() {
	selectedWeek = document.getElementById("weekDropdown").index;
	selectedMonth = document.getElementById("monthDropdown").value;
	selectedYear = document.getElementById("yearDropdown").value;
}
function checkAllDropdownsSelected() {
	for (const isSelected of dropDowns) {
		if (!isSelected) {
			return; // if any dropdown is not selected, exit the function early
		}
	}
	// If the function hasn’t returned by this point, all dropdowns are selected
	allDropsSelected = true;
}
function timeDescription(value) {
	const descriptions = ["Days 1-7", "Days 8-14", "Days 15-22", "Days 23+"];
	return descriptions[value];
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
			if (id == "datesMenu") {
				text = "";
				if (selectedWeek != null) {
					text += timeDescription(selectedWeek) + " ";
				}
				if (selectedMonth != null) {
					text += selectedMonth + " ";
				}
				if (selectedYear != null) {
					text += selectedYear + " ";
				}
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
// Function to parse date strings into a Date object
function parseDate(dateStr) {
	let parts;
	if (dateStr.includes("/")) {
		console.log("/ format: " + dateStr);
		// Format: "month/day/year"
		parts = dateStr.split("/");
		let year = parseInt(parts[2], 10);
		// Check if the year is in two-digit format, adjust if necessary
		if (year < 100) year += 2000;
		return new Date(year, parseInt(parts[0], 10) - 1, parseInt(parts[1], 10));
	} else {
		// Format: "year-month-day"
		console.log("- format: " + dateStr);
		parts = dateStr.split("-");
		return new Date(parts[0], parts[1] - 1, parts[2]);
	}
}

//code review start
function plotSelectedGraph(lists, index, listStr) {
	const container = document.getElementById("innergraph");
	container.innerHTML = "";
	//get the selected measurement type
	const dbFieldName = getDatabaseFieldName(selectedMeasurement);
	if (!dbFieldName) {
		console.error("Invalid measurement selected:", selectedMeasurement);
		return;
	}
	// Filter data by selected site, valid values, and selected year
	const yearlyFilteredData = lists.filter((data) => {
		if (
			data.userSite &&
			data.userSite.toLowerCase() === selectedSite.toLowerCase() &&
			data[dbFieldName] !== null &&
			data[dbFieldName] !== undefined &&
			data[dbFieldName] !== ""
		) {
			//console.log("datadate " + data.date);
			const parsedDate = parseDate(data.date);
			return parsedDate.getFullYear() === selectedYear;
		}
		return false;
	});

	//console.log(yearlyFilteredData);

	if (yearlyFilteredData.length === 0) {
		console.error(
			"No data available for the selected measurement:",
			selectedMeasurement
		);
		return;
	}

	// Initialize arrays for each month (March to November)
	let monthlyData = Array.from({ length: 9 }, () => []);

	// Populate the monthlyData arrays by seperating values based upon month
	yearlyFilteredData.forEach((data) => {
		let month = parseDate(data.date).getMonth();
		if (month >= 2 && month <= 10) {
			// 2 is March, 10 is November
			monthlyData[month - 2].push(data[dbFieldName]);
		}
	});

	// Calculate average for each month and store in a new array
	let monthlyAverages = monthlyData.map((month) => {
		if (month.length === 0) return 0;
		return month.reduce((sum, val) => sum + val, 0) / month.length;
	});

	// Pass the sorted monthly averages to the graph plotting function
	plotGraphWithAverage(monthlyAverages, listStr, processDropdownMenus());
}

function getDaysInMonth(month, year) {
	return new Date(year, month, 0).getDate();
}

//code review part 2
function plotGraphWithAverage(dataset, plotStrList, labelStr) {
	// Get the container and create a canvas element
	const container = document.getElementById("innergraph");
	const canvas = document.createElement("canvas");
	container.appendChild(canvas);
	// Get the 2D context of the canvas
	const ctx = canvas.getContext("2d");

	// Calculate the average curve
	const averageCurve = cumulativeMovingAverage(dataset);
	let unitStr; //var to hold the unit for measurement (cm or deg celsius)
	const measurementMapping = {
		"Water Depth": "waterDepth",
		"Sample Distance": "sampleDist",
		"Air Temperature": "airTempAvg",
		"Water Temperature": "waterTempAvg",
		"Secchi Depth": "secchiAvg",
	};
	switch (selectedMeasurement) {
		case "Water Depth":
			unitStr = "cm";
			break;
		case "Sample Distance":
			unitStr = "cm";
			break;
		case "Air Temperature":
			unitStr = "Degrees Celsius";
			break;
		case "Water Temperature":
			unitStr = "Degrees Celsius";
			break;
		case "Secchi Depth":
			unitStr = "cm";
			break;
	}
	// Create chart --> Graphs the averages for each month over the year
	new Chart(ctx, {
		type: "line",
		data: {
			labels: plotStrList, // Use plotStrList for the x-axis labels
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
					text: labelStr, // Use labelStr for the chart title
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
						text: "Month	",
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
						text: unitStr,
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
		if (isUserLoggedIn()) {
			console.log("is logged in.");
			document.location.href = "/menu.html";
		} else {
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
					myList = ["Yearly"];
					updateSelectionsContainer(myList, menu, "Time: ", 2);
					break;

				case "valuesMenu":
					// you might want to populate myList appropriately
					myList = ["Annual Running Average"];
					updateSelectionsContainer(myList, menu, "", 3);
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
document.addEventListener("DOMContentLoaded", function () {
	populateMonthYearDropdowns();
});
