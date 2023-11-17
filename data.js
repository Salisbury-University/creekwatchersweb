const homeBtn = document.getElementById("homebtn");
const userData = [];
// Reference to the "UserData" collection
const userDataCollection = db.collection("UserData");
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

const tideMapping = {
    "High": 5,
    "Middle Falling": 4,
    "Low": 3,
	"Middle Flooding": 2,
	"Non-Tridal": 1,
	"nan": 0
};

const surfMapping = {
	"Heavy Chop": 4,
	"Choppy": 3,
	"Ripples": 2,
	"Calm": 1,
	"nan": 0
};

const weatherMapping = {
    "Snow": 8,
    "Fog": 7,
    "Heavy Rain": 6,
	"Rain": 5, 
	"Light Rain": 4,
	"Cloudy": 3,
	"Partly Cloudy": 2,
	"Clear": 1,
	"nan": 0
};

const windSpeedMapping = {
	"Heavy": 4,
	"Medium": 3,
	"Light": 2,
	"Calm": 1,
	"nan": 0
};

const windDirMapping = {
	"nan": 0,
	"North": 1,
	"North East": 2,
	"North West": 3,
	"East": 4,
	"West": 5,
	"South East": 6,
	"South West": 7,
	"South": 8 
};

const rainMapping = {
	"Unusual Storm": 6,
	"Heavy": 5,
	"Medium": 4,
	"Light": 3,
	"Trace": 2,
	"None": 1,
	"nan": 0
};

//event listeners
window.addEventListener("load", () => {
    homeBtn.addEventListener("click", () => {
        window.location.href = "/home.html";
    });
    setInterval(() => {
        setRandomBackColor(document.body);
    }, 10000);

    // Function Calls on Load
    createHeaderRow();
    createDataRow(userData); // Initially passing userData, assuming it's populated
    queryData();
});

document.getElementById('sortButton').addEventListener('click', () => {
    let primarySortOption = document.getElementById('primarySort').value;
    let secondarySortOption = document.getElementById('secondarySort').value;

	console.log("Sorting with:", primarySortOption, secondarySortOption); // Debugging log

    let sortedResult = sortData(userData, primarySortOption, secondarySortOption);

	console.log("Sorted Result:", sortedResult); // Debugging log

	clearExistingData();
    createDataRow(sortedResult);
});

document.getElementById('primarySort').addEventListener('change', function(){
	if (this.value){
		document.getElementById('secondarySort').disabled = false;
	} else {
		document.getElementById('secondarySort').disabled = true;
	}
});

//Functions

// Function to get data from firebase and stores it in an array
function queryData() {
	userDataCollection.get().then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				// Push each document's data into the array
				userData.push(doc.data());
			});
			// Log the array to confirm data is stored
			console.log(userData);
			createDataRow(userData);
		})
		.catch((error) => {
			console.log("Error getting documents: ", error);
		});
}

function compareAlphabetically(a, b) {
    return a.localeCompare(b);
}

function compareBoolean(a, b) {
    return (a === b ? 0 : a ? -1 : 1);
}

function compareNumerically(a, b) {
    return Number(a) - Number(b);
}

function compareEstimates(a, b){

}

function compareByField(a, b, field) {
	
	switch(field){
		case 'tideEst':
			return compareNumerically(tideMapping[a[field]], tideMapping[b[field]]);
		case 'weatherEst':
			return compareNumerically(weatherMapping[a[field]], weatherMapping[b[field]]);
		case 'waterSurf':
			return compareNumerically(surfMapping[a[field]], surfMapping[b[field]]);
		case 'windSpeed':
			return compareNumerically(windSpeedMapping[a[field]], windSpeedMapping[b[field]]);
		case 'windDir':
			return compareNumerically(windDirMapping[a[field]], windDirMapping[b[field]]);
		case 'rainfall':
			return compareNumerically(rainMapping[a[field]], rainMapping[b[field]]);
		default:
			if (typeof a[field] === 'string') {
				return compareAlphabetically(a[field], b[field]);
			} else if (typeof a[field] === 'boolean') {
				return compareBoolean(a[field], b[field]);
			} else {
				return compareNumerically(a[field], b[field]);
			}
	}
}

function sortData(data, primarySort, secondarySort) {
	
	let sortedArray = data.sort((a, b) => {
		
		let primaryCompare = compareByField(a, b, primarySort);

        if (primaryCompare !== 0 || !secondarySort) {
			return primaryCompare;
		}
		if (primaryCompare === 0 && secondarySort) {
            return compareByField(a, b, secondarySort);
        }

    });

	console.log("Sorted Array: ", sortedArray);
	return sortedArray;

}

function clearExistingData() {
    const dataRowsContainer = document.getElementById("dataRowsContainer");
    while (dataRowsContainer.firstChild) {
        dataRowsContainer.removeChild(dataRowsContainer.firstChild);
    }
}

function createDataRow(dataArray) {
	console.log("createDataRow called");
	clearExistingData();
	dataArray.forEach((doc) => {
        // Assuming 'doc' is an object with your data, similar to what Firebase would return
        const data = doc; // If 'doc' is already your data object, no need to call 'doc.data()'

        // Create a new row element
        const newRow = document.createElement("div");
        newRow.classList.add("row");

        // Loop to generate blocks for data
        const dataFields = [
            data.userName,
            data.date,
            data.userSite,
            data.tideEst,
            data.weathEst,
            data.waterSurf,
            data.windSpeed,
            data.windDir,
            data.rainfall,
            data.waterDepth,
            data.sampleDist,
            data.airTempAvg,
            data.waterTempAvg,
            data.secchiAvg,
            data.bottomedOut,
            data.usedTube,
            data.pbottle,
            data.glassbottle,
            data.comments
        ];

        for (let i = 0; i < dataFields.length; i++) {
            const block = document.createElement("div");
            block.classList.add("block");
            block.innerText = dataFields[i];
            newRow.appendChild(block);
        }

        // Append the new data row to the main container
        const mainContainer = document.getElementById("dataRowsContainer");
        mainContainer.appendChild(newRow);
	});
}

function createHeaderRow() {
	const headers = [
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
		"Bottomed Out",
		"Tube Used",
		"Plastic Bottle",
		"Glass Bottle",
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
	const mainContainer = document.getElementById("headerContainer");
	mainContainer.appendChild(headerRow);
}

function setRandomBackColor(element) {
	const randomColor =
		galaxyColors[Math.floor(Math.random() * neonColors.length)];
	element.style.backgroundColor = randomColor;
}