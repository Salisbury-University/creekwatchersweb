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

console.log(userDataCollection);
// Query
let homeBtn = document.getElementById("graphhomebtn");
const confirmBtn = document.getElementById("confirmBtn");
// Varriables
let allDropsSelected = false;
const timeframeDropdown = document.getElementById("datesMenu");
let selectedWeek, selectedMonth, selectedYear;
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
			// Log the array to confirm data is stored
			console.log(databaseData);
		})
		.catch((error) => {
			console.log("Error getting documents: ", error);
		});
}
function filterDataBySelection() {
	// Convert the selected month to a number
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
	const monthNumber = monthNames.indexOf(selectedMonth); // 0-11
	console.log(databaseData);
	// Filter based on the selected time frame
	let filteredData = databaseData.filter((data) => {
		// Assuming each data entry has a 'date' field in the format "yyyy-mm-dd"
		let entryDate = new Date(data.date);
		let entryYear = entryDate.getFullYear();
		let entryMonth = entryDate.getMonth(); // 0-11

		switch (curTimeSpan) {
			// case "Weekly":
			// 	let weekStart = new Date(
			// 		selectedYear,
			// 		monthNumber,
			// 		selectedWeek * 7 + 1
			// 	);
			// 	let weekEnd = new Date(selectedYear, monthNumber, selectedWeek * 7 + 7);
			// 	return entryDate >= weekStart && entryDate <= weekEnd;
			case "Monthly":
				return (
					entryYear === parseInt(selectedYear) && entryMonth === monthNumber
				);
			case "Yearly":
				return entryYear === parseInt(selectedYear);
			default:
				return false;
		}
	});

	// Process the filtered data as needed
	console.log("Filtered: ");
	console.log(filteredData);
	console.log(filteredData);
	return filteredData;
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
			menu.appendChild(selectIcon);
			let testInd = 3;
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
			console.log(selectSwitchStr);
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
			myDataSet = [
				[10, 30, 20, 20, 10, 40, 10, 25, 30, 40],
				[7, 4, 12, 1],
				[2, 6, 8, 2, 12, 10, 2, 2, 6, 8, 4, 4],
				[5, 10, 15],
			];
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
			if (allDropsSelected == true) {
				plotSelectedGraph(myDataSe	t, testInd, listStr);
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
			return 1;
		case "Yearly":
			return 2;
		default:
			return -1; // Default or error case
	}
}
function updateListStrForGraph() {
	// Ensure selectedMonth is converted to month number correctly
	const monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
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
		selectedYear = document.getElementById("yearDropdown").value;
	} else {
		// Yearly or other modes
		selectedWeek = null;
		selectedMonth = null;
		selectedYear = document.getElementById("yearDropdown").value;
	}

	// Update listStr based on selectedWeek and selectedMonth
	updateListStrForGraph();

	// Re-plot the graph with the new selections
	if (allDropsSelected == true)
		plotSelectedGraph(myDataSet, determineTestIndex(), listStr);
	filteredDatabaseData = filterDataBySelection();
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
	// Here you can use these values as needed
	console.log(selectedWeek, selectedMonth, selectedYear);
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

	const dataValues = filteredData.map(data => {
        // Assuming 'data' has a 'value' field
        return data.value;
    });

	const plotStrList = filteredData.map(data => {
        // Assuming 'data' has a 'time' field
        return data.time;
    });

	// Adjust listStr based on selectedWeek and selectedMonth
	// if (curTimeSpan === "Weekly") {
	// 	// Convert month name to month number
	// 	const monthNumber =
	// 		new Date(Date.parse(selectedMonth + " 1, 2022")).getMonth() + 1;
	// 	const daysInMonth = getDaysInMonth(monthNumber, selectedYear);

	// 	let startDay = selectedWeek * 7 + 1;
	// 	let endDay = startDay + 6;
	// 	if (selectedWeek === 3) {
	// 		// If it's the last week selection
	// 		endDay = daysInMonth;
	// 	}

	// 	listStr = [];
	// 	for (let day = startDay; day <= endDay; day++) {
	// 		listStr.push("Day " + day);
	// 	}
	// }

	plotGraphWithAverage(selectedList, listStr, processDropdownMenus());
}

function getDaysInMonth(month, year) {
	return new Date(year, month, 0).getDate();
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
					myList = ["Monthly", "Yearly", "Select Range"];
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
