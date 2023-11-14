// Function to set the user login status
function setUserLoggedInStatus(isLoggedIn) {
	localStorage.setItem('isUserLoggedIn', isLoggedIn);
}

// Function to get the user login status
function isUserLoggedIn() {
	return localStorage.getItem('isUserLoggedIn') === 'true';
}
