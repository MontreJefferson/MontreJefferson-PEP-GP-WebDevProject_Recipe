/**
 * This script defines the add, view, and delete operations for Ingredient objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * Get references to various DOM elements
 * - addIngredientNameInput
 * - deleteIngredientNameInput
 * - ingredientListContainer
 * - searchInput (optional for future use)
 * - adminLink (if visible conditionally)
 */

const addIngredientNameInput = document.getElementById("add-ingredient-name-input");
const addIngrendientButton = document.getElementById("add-ingredient-submit-button");
const deleteIngredientNameInput = document.getElementById("delete-ingredient-name-input");
const deleteIngredientButton = document.getElementById("delete-ingredient-submit-button");
const ingredientListContainer = document.getElementById("ingredient-list");

/* 
 * Attach 'onclick' events to:
 * - "add-ingredient-submit-button" → addIngredient()
 * - "delete-ingredient-submit-button" → deleteIngredient()
 */

addIngrendientButton.onclick = addIngredient;
deleteIngredientButton.onclick = deleteIngredient;

/*
 * Create an array to keep track of ingredients
 */

let ingredients = [];

/* 
 * On page load, call getIngredients()
 */

window.onload = () => getIngredients();

/**
 * Add Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from addIngredientNameInput
 * - Validate input is not empty
 * - Send POST request to /ingredients
 * - Include Authorization token from sessionStorage
 * - On success: clear input, call getIngredients() and refreshIngredientList()
 * - On failure: alert the user
 */
async function addIngredient() {
    const ingredientName = addIngredientNameInput.value.trim();

        if (ingredientName.length < 1) {
            //Error: Invalid fields
            alert("Fields must all be filled")
            return;
        }

    const requestBody = { name: ingredientName };
    const requestOptions = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${sessionStorage.getItem("auth-token")}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
    };
    try {
        const response = await fetch(`${BASE_URL}/ingredients`, requestOptions);

        if (response.ok) {
            //Clear inputs
            addIngredientNameInput.value = "";

            //Get new ingredients and refresh
            await getIngredients();

        } else {
            alert("Unexpected Error!")
            return;
        }

    } catch (error) {
        console.error('Error:', error)
        alert("Error processing request")
    }
}


/**
 * Get Ingredients Function
 * 
 * Requirements:
 * - Fetch all ingredients from backend
 * - Store result in `ingredients` array
 * - Call refreshIngredientList() to display them
 * - On error: alert the user
 */
async function getIngredients() {
    const requestOptions = {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${sessionStorage.getItem("auth-token")}`
        },
    };

    try {
        const request = await fetch(`${BASE_URL}/ingredients`, requestOptions)

        if(!request.ok){
            alert("Error getting ingredients")
            return
        }

        //Populate array
        ingredients = await request.json();

        //Refresh the list
        refreshIngredientList();

    } catch (error) {
        console.error('Error:', error)
        alert("Error getting ingredients")
    }
}


/**
 * Delete Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from deleteIngredientNameInput
 * - Search ingredientListContainer's <li> elements for matching name
 * - Determine ID based on index (or other backend logic)
 * - Send DELETE request to /ingredients/{id}
 * - On success: call getIngredients() and refreshIngredientList(), clear input
 * - On failure or not found: alert the user
 */
async function deleteIngredient() {
    const ingredientName = deleteIngredientNameInput.value.trim();
        if (ingredientName.length < 1) {
            //Error empty fields
            alert("Empty Field Error")
            return;
        }
    const requestOptions = {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${sessionStorage.getItem("auth-token")}`
        },
    };
    try {

        //Search for the ingredient by name through the use of ?term=
        const searchRequest = await fetch(`${BASE_URL}/ingredients?term=${encodeURIComponent(ingredientName)}`);

        //Handle Errors
        if (!searchRequest.ok) {
        alert("Failed to search ingredient")
        return;
        }

        const ingredientToDelete = await searchRequest.json();

        // Handle Errors
        if (!ingredientToDelete || ingredientToDelete.length < 1) {
            alert("Ingredient not found")
            return;
        }
        //Get id of retrieved ingredient
        const ingredientId = ingredientToDelete[0].id;

        //Send delete request
        const deleteRequest = await fetch(`${BASE_URL}/ingredients/${ingredientId}`, requestOptions);

        if (deleteRequest.ok) {
            //Clear inputs
            deleteIngredientNameInput.value = "";

            //Get new ingredients and refresh
            await getIngredients();

        } else {
            alert("Failed to delete ingredient. " + deleteRequest.status)
            return;
        }
    } catch (error) {
        console.error('Error:', error)
        alert("Error processing delete request")
    }
}


/**
 * Refresh Ingredient List Function
 * 
 * Requirements:
 * - Clear ingredientListContainer
 * - Loop through `ingredients` array
 * - For each ingredient:
 *   - Create <li> and inner <p> with ingredient name
 *   - Append to container
 */
function refreshIngredientList() {
    //Clear list
    ingredientListContainer.innerHTML = "";

    //Loop through array and create an elements to append to the container
    ingredients.forEach(item => {
        const li = document.createElement("li");
        const p = document.createElement("p");
        p.textContent = item.name;
        li.appendChild(p);
        ingredientListContainer.appendChild(li);
    });
}