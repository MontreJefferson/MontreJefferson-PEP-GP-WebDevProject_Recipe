/**
 * This script handles the login functionality for the Recipe Management Application.
 * It manages user authentication by sending login requests to the server and handling responses.
*/
const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * Get references to DOM elements
 * - username input
 * - password input
 * - login button
 * - logout button (optional, for token testing)
 */
const username = document.getElementById("login-input");
const password = document.getElementById("password-input");
const loginbutton = document.getElementById("login-button");

/* 
 * Add click event listener to login button
 * - Call processLogin on click
 */

loginbutton.onclick = processLogin;


/**
 * Process Login Function
 * 
 * Requirements:
 * - Retrieve values from username and password input fields
 * - Construct a request body with { username, password }
 * - Configure request options for fetch (POST, JSON headers)
 * - Send request to /login endpoint
 * - Handle responses:
 *    - If 200: extract token and isAdmin from response text
 *      - Store both in sessionStorage
 *      - Redirect to recipe-page.html
 *    - If 401: alert user about incorrect login
 *    - For others: show generic alert
 * - Add try/catch to handle fetch/network errors
 * 
 * Hints:
 * - Use fetch with POST method and JSON body
 * - Use sessionStorage.setItem("key", value) to store auth token and admin flag
 * - Use `window.location.href` for redirection
 */
async function processLogin() {
    // Retrieve username and password from input fields
    // - Trim input and validate that neither is empty
    const usernameValue = username.value;
    const passwordValue = password.value;

    if(usernameValue.trim().length < 1 || passwordValue.trim().length < 1){
        alert("Fields cannot be empty.")
        return;
    }

    // Create a requestBody object with username and password
    const requestBody = { username: usernameValue, password: passwordValue };

    const requestOptions = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(requestBody)
    };

    try {
        // Send POST request to http://localhost:8081/login using fetch with requestOptions
        const response = await fetch(`${BASE_URL}/login`, requestOptions);

        // If response status is 200
        // - Read the response as text
        // - Response will be a space-separated string: "token123 true"
        // - Split the string into token and is-admin flag
        // - Store both in sessionStorage using sessionStorage.setItem()

        // Optionally show the logout button if applicable

        // Add a small delay (e.g., 500ms) using setTimeout before redirecting
        // - Use window.location.href to redirect to the recipe page

        // If response status is 401
        // - Alert the user with "Incorrect login!"

        // For any other status code
        // - Alert the user with a generic error like "Unknown issue!"

        if (response.status === 200) {
            const text = await response.text();
            const responseTextArray = text.split(" ");

            sessionStorage.setItem("auth-token", responseTextArray[0])
            sessionStorage.setItem("is-admin", responseTextArray[1])

            setTimeout(() => {
                window.location.href = "../recipe/recipe-page.html";
            }, 500);

        } else if (response.status === 401){
           // Incorrect Login alert
           alert("Incorrect Login!")
           return;

        } else {
           // Unknown issue alert
           alert("Unknown Issue!")
           return;
        }

    } catch (error) {
        // Handle any network or unexpected errors
        // - Log the error and alert the user
        console.error('Error:', error)
        alert("Login Error")
    }
}
