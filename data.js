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
		window.location.href = "/menu.html";
	});
});

//functions

function compareAlphabetically(a, b) {
    return a.localeCompare(b);
}

function compareBoolean(a, b) {
    return (a === b ? 0 : a ? -1 : 1);
}

function compareNumerically(a, b) {
    return Number(a) - Number(b);
}


function sortData(querySnapshot, primarySort, secondarySort) {
    let sortedArray = querySnapshot.docs.sort((a, b) => {
        let aData = a.data();
		let bData = b.data();
		
		let primaryCompare;
		switch (primarySort){
			case 'userName':
			case 'userSite':
			case 'glassbottle':
				primaryCompare = compareAlphabetically(aData[primarySort], bData[primarySort]);
				break;
			case 'bottomedOut':
			case 'usedTube':
				primaryCompare = compareBoolean(aData[primarySort], bData[primarySort]);
				break;
			case 'waterDepth':
			case 'waterTempAvg':
			case 'airTempAvg':
			case 'secchiDepthAvg':
				primaryCompare = compareNumerically(aData[primarySort], bData[primarySort]);
				break;
		}

        if (primaryCompare !== 0 || !secondarySort) return primaryCompare;
		return a.data()[secondarySort].localeCompare(b.data()[secondarySort]);		
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

function createDataRow() {
	console.log("createDataRow called");

    // Reference to the "UserData" collection
    const userDataCollection = db.collection("UserData");

	// Get Sort Options
	let primarySort = document.getElementById('primarySort').value;
    let secondarySort = document.getElementById('secondarySort').value;

	console.log("Sorting by: ", primarySort, secondarySort); // For debugging

    // Query the collection to get the data
    userDataCollection.get().then((querySnapshot) => {
        console.log("Data fetched:", querySnapshot.docs.length); // Check if data is fetched
		
		// Sort the data based on the selected options
        let sortedData = sortData(querySnapshot, primarySort, secondarySort);

		
		sortedData.forEach((doc) => {
            // Get the data from the document
            const data = doc.data();

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
            const mainContainer = document.getElementById("datamaincontainer");
            mainContainer.appendChild(newRow);
        });
    });
}

document.getElementById('sortButton').addEventListener('click', function() {
    clearExistingData(); // Clear the existing data
    createDataRow(); // Then populate with sorted data
});

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
createDataRow();


// Reference to the "UserData" collection
const userDataCollection = db.collection("UserData");

// Query the collection to get the data
userDataCollection.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        // Get the data from the document
        const data = doc.data();

        // Populate HTML elements with the data
        document.getElementById("userName").textContent = data.userName;
		if (userNameElement) {
			userNameElement.textContent = data.userName;
		}
        document.getElementById("userSite").textContent = data.userSite;
        document.getElementById("airTempAvg").textContent = data.airTempAvg;
		document.getElementById("bottomedOut").textContent = data.bottomedOut;
		document.getElementById("date").textContent = data.date;
		document.getElementById("glassbottle").textContent = data.glassbottle;
		document.getElementById("pbottle").textContent = data.pbottle;
		document.getElementById("rainfall").textContent = data.rainfall;
		document.getElementById("sampleDist").textContent = data.sampleDist;
		document.getElementById("secchiAvg").textContent = data.secchiAvg;
		document.getElementById("tideEst").textContent = data.tideEst;
		document.getElementById("usedTube").textContent = data.usedTube;
		document.getElementById("userName").textContent = data.userName;
		document.getElementById("userID").textContent = data.userID;
		document.getElementById("userSite").textContent = data.userSite;
		document.getElementById("waterDepth").textContent = data.waterDepth;
		document.getElementById("waterSurf").textContent = data.waterSurf;
		document.getElementById("waterTempAvg").textContent = data.waterTempAvg;
		document.getElementById("weathEst").textContent = data.weathEst;
		document.getElementById("windDir").textContent = data.windDir;
		document.getElementById("windSpeed").textContent = data.windSpeed;
	});
});

