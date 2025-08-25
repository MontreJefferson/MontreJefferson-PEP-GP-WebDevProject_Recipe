/**
 * This script defines the add, view, and delete operations for Ingredient objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to various DOM elements
 * - addIngredientNameInput
 * - deleteIngredientNameInput
 * - ingredientListContainer
 * - searchInput (optional for future use)
 * - adminLink (if visible conditionally)
 */

let addIngredientNameInput = document.getElementById("add-ingredient-name-input");
let addIngrendientButton = document.getElementById("add-ingredient-submit-button");
let deleteIngredientNameInput = document.getElementById("delete-ingredient-name-input");
let deleteIngredientButton = document.getElementById("delete-ingredient-submit-button");
let ingredientListContainer = document.getElementById("ingredient-list");

/* 
 * TODO: Attach 'onclick' events to:
 * - "add-ingredient-submit-button" → addIngredient()
 * - "delete-ingredient-submit-button" → deleteIngredient()
 */

addIngrendientButton.onclick = addIngredient;
deleteIngredientButton.onclick = deleteIngredient;

/*
 * TODO: Create an array to keep track of ingredients
 */

let ingredients = [];

/* 
 * TODO: On page load, call getIngredients()
 */

window.onload = () => getIngredients();

/**
 * TODO: Add Ingredient Function
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
    let ingredientName = addIngredientNameInput.value.trim();

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
        if (ingredientName.length < 1) {
            //Error: Invalid fields
            alert("Fields must all be filled")
            throw new Error("Fields must all be filled.")
        }
        
        const response = await fetch(`${BASE_URL}/ingredients`, requestOptions);

        if (response.ok) {
            //Clear inputs
            addIngredientNameInput.value = "";

            //Get new ingredients and refresh
            await getIngredients();

        } else {
            alert("Error adding ingredient")
        }

    } catch (error) {
        console.error('Error:', error)
    }
}


/**
 * TODO: Get Ingredients Function
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

        ingredients = await request.json();

        refreshIngredientList();

    } catch (error) {
        console.error('Error:', error)
        error("Error getting ingredients")
    }
}


/**
 * TODO: Delete Ingredient Function
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
    let ingredientName = deleteIngredientNameInput.value.trim();
        if (ingredientName.length < 1) {
            //Error empty fields
            alert("Empty Field Error");
            return;
        }
    const requestOptions = {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${sessionStorage.getItem("auth-token")}`
        },
    };
    try {

        const searchRequest = await fetch(`${BASE_URL}/ingredients?term=${encodeURIComponent(ingredientName)}`);

        if (!searchRequest.ok) {
        alert("Failed to search ingredient");
        return;
        }

        const ingredientToDelete = await searchRequest.json();

        if (!ingredientToDelete || ingredientToDelete.length < 1) {
            alert("Ingredient not found");
            return;
        }
        const ingredientId = ingredientToDelete[0].id;

        const deleteRequest = await fetch(`${BASE_URL}/ingredients/${ingredientId}`, requestOptions);

        if (deleteRequest.ok) {
            //Clear inputs
            deleteIngredientNameInput.value = "";

            //Get new ingredients and refresh
            await getIngredients();

        } else {
            alert("Failed to delete ingredient. " + deleteRequest.status);
        }
    } catch (error) {
        console.error('Error:', error)
    }
}


/**
 * TODO: Refresh Ingredient List Function
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