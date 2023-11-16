const tileContainer = document.getElementById("tileContainer");
const homeBtn = document.getElementById("homebtn");
const loginBtn = document.getElementById("loginButton");
const forgotBtn = document.getElementById("forgotButton");
const passwordInput = document.getElementById("password");
const usernameInput = document.getElementById("username");

setUserLoggedInStatus(false);

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

const tilesAcrossWidth = 20;
const tileSize = window.innerWidth / tilesAcrossWidth;
const numRows = Math.ceil(window.innerHeight / tileSize);
const numCols = tilesAcrossWidth;

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

function loginUser() {
	const errorMessageElement = document.querySelector('.error-message');

    var email = document.getElementById('username').value;
    var password = document.getElementById('password').value;
	
	firebase.auth().signInWithEmailAndPassword(email, password)
	.then((userCredential) => {
		const user = userCredential.user;
		console.log(user);
		setUserLoggedInStatus(true);
		window.location.href = "/menu.html";
	})
	.catch((error) => {
		const errorCode = error.code;
		const errorMessage = error.message;

		switch (errorCode) {
			case 'auth/invalid-email':
				errorMessageElement.textContent = 'Invalid Login';
				break;
			case 'auth/user-not-found':
				errorMessageElement.textContent = 'User not found';
				break;
			case 'auth/wrong-password':
				errorMessageElement.textContent = 'Incorrect password';
				break;
			default:
				errorMessageElement.textContent = 'Invalid Login';
		}
	});

}

const auth = firebase.auth();

function openForgotPopup() {
	console.log("Opening popup window...");
	document.getElementById('forgotPopup').style.display = 'block';
	document.getElementById('mainContent').style.display = 'none';
}

function closeForgotPopup() {
  document.getElementById('forgotPopup').style.display = 'none';
  document.getElementById('mainContent').style.display = '';
}

function handleForgotPassword() {
  const email = document.getElementById('forgotemail').value;

  auth.sendPasswordResetEmail(email)
	.then(() => {
	  console.log('Password reset email sent');
	  alert('Password reset email sent. Check your inbox.');
	  closeForgotPopup();
	})
	.catch((error) => {
	  console.error(error.message);
	  alert('Error: ' + error.message);
	});
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

	loginBtn.addEventListener("click", () => {
		loginUser();
	});

	forgotBtn.addEventListener("click", () => {
		openForgotPopup();
	});

	passwordInput.addEventListener("keydown", function (event) {
		// Check if the pressed key is Enter (key code 13)
		if (event.keyCode === 13) {
		  // Call your function here
		  loginUser();
		}
	  });
	
	usernameInput.addEventListener("keydown", function (event) {
	// Check if the pressed key is Enter (key code 13)
	if (event.keyCode === 13) {
		// Call your function here
		loginUser();
	}
	});

});
