/**
 * This script handles the login functionality for the Recipe Management Application.
 * It manages user authentication by sending login requests to the server and handling responses.
*/
const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to DOM elements
 * - username input
 * - password input
 * - login button
 * - logout button (optional, for token testing)
 */
let username = document.getElementById("login-input");
let password = document.getElementById("password-input");
let loginbutton = document.getElementById("login-button");

/* 
 * TODO: Add click event listener to login button
 * - Call processLogin on click
 */

loginbutton.onclick = processLogin;


/**
 * TODO: Process Login Function
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
    // TODO: Retrieve username and password from input fields
    // - Trim input and validate that neither is empty
    let usernameValue = username.value.trim();
    let passwordValue = password.value.trim();

    if(usernameValue.length < 1 || passwordValue.length < 1){
        throw new Error("Fields cannot be empty.")
    }

    // TODO: Create a requestBody object with username and password
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
        // TODO: Send POST request to http://localhost:8081/login using fetch with requestOptions
        const request = new Request(`${BASE_URL}/login`, requestOptions);

        const response = await fetch(request);

        // TODO: If response status is 200
        // - Read the response as text
        // - Response will be a space-separated string: "token123 true"
        // - Split the string into token and is-admin flag
        // - Store both in sessionStorage using sessionStorage.setItem()

        // TODO: Optionally show the logout button if applicable

        // TODO: Add a small delay (e.g., 500ms) using setTimeout before redirecting
        // - Use window.location.href to redirect to the recipe page

        // TODO: If response status is 401
        // - Alert the user with "Incorrect login!"

        // TODO: For any other status code
        // - Alert the user with a generic error like "Unknown issue!"

        if (response.status === 200) {
            const text = await response.text();
            let responseTextArray = text.split(" ");

            sessionStorage.setItem("auth-token", responseTextArray[0])
            sessionStorage.setItem("is-admin", responseTextArray[1])

            setTimeout(() => {
                location.href = "../recipe/recipe-page.html";
            }, 500);

        } else if (response.status === 401){
           // Incorrect Login alert
           alert("Incorrect Login!")

        } else {
           // Unknown issue alert
           alert("Unknown Issue!!!")
        }

    } catch (error) {
        // TODO: Handle any network or unexpected errors
        // - Log the error and alert the user
        console.error('Error:', error)
        alert("Login Error")
    }
}
