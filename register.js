const tileContainer = document.getElementById("tileContainer");
const homeBtn = document.getElementById("homebtn");
const loginBtn = document.getElementById("loginButton");

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


// User Registration Function
function registerUser() {

	const errorMessageElement = document.querySelector('.error-message');
	const email = document.getElementById("username").value;
	const password = document.getElementById("password").value;
  
	firebase.auth().createUserWithEmailAndPassword(email, password)
	  .then((userCredential) => {
		// Registration successful
		const user = userCredential.user;
		console.log("User registered: " + user.email);
		errorMessageElement.style.color = 'green';
		errorMessageElement.textContent = 'User Registered: ' + user.email;
	  })
	  .catch((error) => {
			// Handle registration errors
			const errorCode = error.code;
			const errorMessage = error.message;
			errorMessageElement.style.color = 'red';
	
			switch (errorCode) {
				case 'auth/invalid-email':
					// Handle invalid email
					console.error('Invalid email');
					errorMessageElement.textContent = 'Invalid email';
					break;
				case 'auth/weak-password':
					// Handle weak password
					console.error('Weak password');
					errorMessageElement.textContent = 'Weak password';
					break;
				case 'auth/email-already-in-use':
					// Handle email already in use
					console.error('Email already in use');
					errorMessageElement.textContent = 'Email already registered: ' + email;
					break;
				default:
					// Handle other errors
					console.error(errorMessage);
					break;
			}
	  });
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

let currentScheme = colorSchemeOcean;
let nextScheme = colorSchemeNightSky;
window.addEventListener("load", () => {
	setInterval(() => {
		transitionColors(currentScheme, nextScheme);

		// Swap schemes for the next transition
		[currentScheme, nextScheme] = [nextScheme, currentScheme];
	}, 4000); // every 4 seconds
	homeBtn.addEventListener("click", () => {
		window.location.href = "/menu.html";
	});
	loginBtn.addEventListener("click", () => {
		registerUser();
	});

});

