const tileContainer = document.getElementById("tileContainer");
const homeBtn = document.getElementById("homebtn");
const panel3 = document.getElementById("panel3"),
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

console.log(window.isLoggedIn);

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
	panel4.addEventListener("click", () => {
		window.location.href = "/data.html";
	});
	panel3.addEventListener("click", () => {
		window.location.href = "/Graph/index.html";
	});
	homeBtn.addEventListener("click", () => {
		setUserLoggedInStatus(false);
		window.location.href = "/home.html";
	});
});

function changePassword(){
	var auth = firebase.auth();
	var user = auth.currentUser;

	if (user) {
		var newPassword = prompt("Enter your new password:");
		user.updatePassword(newPassword).then(function () {
			console.log("Password updated successfully");
			alert("Password changed successfully!");
	}).catch(function (error) {
		console.error("Error updating password:", error.message);
		switch (error.code) {
			case "auth/weak-password":
			  alert("The password is too weak. Please choose a stronger password.");
			  break;
			case "auth/requires-recent-login":
			  alert("For security reasons, you need to re-authenticate before changing the password. Please log in again.");
			  break;
			default:
			  alert("Password change error.");
		  }
	});
	} else {
	console.log("No user is signed in.");
	}
}


let disableHoverEffect = false;
function rotateSettingsBtn() {
	var settingsBtn = document.getElementById('settingsbtn');
	const popup = document.getElementById("popup1");
	disableHoverEffect = true;
	settingsBtn.classList.add('disable-hover');
	settingsBtn.classList.add('rotate');
  
	// Add a delay before showing the popup (1000ms = 1 second)
	setTimeout(function() {
		popup.style.display = "block";
		settingsBtn.classList.remove('rotate'); // Remove the rotate class after the animation
		disableHoverEffect = false;
		settingsBtn.classList.remove('disable-hover');
	}, 150);
}

document.addEventListener("DOMContentLoaded", function () {
    const settingsBtn = document.getElementById("settingsbtn");
    const popup = document.getElementById("popup1");
	const popBtn1 = document.getElementById("popbtn1");
	const popBtn2 = document.getElementById("popbtn2");
    
	settingsBtn.addEventListener("click", function () {
		rotateSettingsBtn();
    });
	
	popup.addEventListener("mouseover", function () {
        popup.style.display = "block";
    });

	popup.addEventListener("mouseout", function () {
        popup.style.display = "none";
    });

    settingsBtn.addEventListener("mouseout", function () {
        popup.style.display = "none";
    });

	popBtn1.addEventListener("click", function () {
        window.location.href = "/register.html";
    });

	popBtn2.addEventListener("click", function () {
		changePassword();
    });

});