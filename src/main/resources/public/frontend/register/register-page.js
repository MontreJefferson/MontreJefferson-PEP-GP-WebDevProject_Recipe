/**
 * This script defines the registration functionality for the Registration page in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to various DOM elements
 * - usernameInput, emailInput, passwordInput, repeatPasswordInput, registerButton
 */
let username = document.getElementById("username-input");
let email = document.getElementById("email-input");
let password = document.getElementById("password-input");
let repeatPassword = document.getElementById("repeat-password-input");
let registerButton = document.getElementById("register-button");



/* 
 * TODO: Ensure the register button calls processRegistration when clicked
 */
registerButton.onclick = processRegistration;

/**
 * TODO: Process Registration Function
 * 
 * Requirements:
 * - Retrieve username, email, password, and repeat password from input fields
 * - Validate all fields are filled
 * - Check that password and repeat password match
 * - Create a request body with username, email, and password
 * - Define requestOptions using method POST and proper headers
 * 
 * Fetch Logic:
 * - Send POST request to `${BASE_URL}/register`
 * - If status is 201:
 *      - Redirect user to login page
 * - If status is 409:
 *      - Alert that user/email already exists
 * - Otherwise:
 *      - Alert generic registration error
 * 
 * Error Handling:
 * - Wrap in try/catch
 * - Log error and alert user
 */
async function processRegistration() {
    // Implement registration logic here
    let usernameValue = username.value;
    let emailValue = email.value;
    let passwordValue = password.value;
    let repeatPasswordValue = repeatPassword.value;

    // Check if fields are filled
    if (usernameValue.trim().length < 1 || emailValue.trim().length < 1 || passwordValue.trim().length < 1){
        alert("Fields must all be filled")
        throw new Error("Fields must all be filled.")
    }
    // Check if passswords match
    if (passwordValue != repeatPasswordValue){
        alert("Passwords must match")
        throw new Error("Passwords must match.")
    }

    const registerBody = { username, email, password };
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
        body: JSON.stringify(registerBody)
    };

    try {
        const request = new Request(`${BASE_URL}/register`, requestOptions);
        
        const response = await fetch(request);

        if (response.status === 201) {
            // Redirect user to login page
            setTimeout(function() {
                location.replace("/login");
            }, 500);

        } else if (response.status === 409){
           // Alert that user/email already exists
           alert("That email already exists")

        } else {
           // Alert generic registration error
           alert("Error processing registration")
        }
        
        console.log("Success:", result)
    } catch (error) {
        console.error('Error:', error)
    }
}