/**
 * This script defines the CRUD operations for Recipe objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

let recipes = [];

// Wait for DOM to fully load before accessing elements
window.addEventListener("DOMContentLoaded", () => {

    /* 
     * Get references to various DOM elements
     * - Recipe name and instructions fields (add, update, delete)
     * - Recipe list container
     * - Admin link and logout button
     * - Search input
    */
    const addRecipeNameField = document.getElementById("add-recipe-name-input");
    const addRecipeInstructionsField = document.getElementById("add-recipe-instructions-input");
    const addRecipeSubmitButton = document.getElementById("add-recipe-submit-input");
    const updateRecipeNameField = document.getElementById("update-recipe-name-input");
    const updateRecipeInstructionsField = document.getElementById("update-recipe-instructions-input");
    const updateRecipeSubmitButton = document.getElementById("update-recipe-submit-input");
    const deleteRecipeNameField = document.getElementById("delete-recipe-name-input");
    const deleteRecipieSubmitButton = document.getElementById("delete-recipe-submit-input");
    const recipeList = document.getElementById("recipe-list");
    const adminLink = document.getElementById("admin-link");
    const logoutButton = document.getElementById("logout-button");
    const searchInputField = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");


    /*
     * Show logout button if auth-token exists in sessionStorage
     */

    logoutButtonDisplayHandler();

    /*
     * Show admin link if is-admin flag in sessionStorage is "true"
     */
    adminLinkDisplayHandler();


    /*
     * Attach event handlers
     * - Add recipe button → addRecipe()
     * - Update recipe button → updateRecipe()
     * - Delete recipe button → deleteRecipe()
     * - Search button → searchRecipes()
     * - Logout button → processLogout()
     */
    addRecipeSubmitButton.addEventListener('click', addRecipe);
    updateRecipeSubmitButton.addEventListener('click', updateRecipe);
    deleteRecipieSubmitButton.addEventListener('click', deleteRecipe);
    searchButton.addEventListener('click', searchRecipes);
    logoutButton.addEventListener('click', processLogout);



    /*
     * On page load, call getRecipes() to populate the list
     */
    window.onload = () => getRecipes();


    /**
     * Search Recipes Function
     * - Read search term from input field
     * - Send GET request with name query param
     * - Update the recipe list using refreshRecipeList()
     * - Handle fetch errors and alert user
     */
    async function searchRecipes() {
        const searchInput = searchInputField.value

        const requestOptions = {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("auth-token")}`
            },
        };

        try {

            const response = await fetch(`${BASE_URL}/recipes?name=${encodeURIComponent(searchInput)}`, requestOptions)

            if(!response.ok){
                alert("Failed to search for recipes")
                return;
            }

            recipes = await response.json();

            refreshRecipeList();

        } catch (error) {
            console.error('Error:', error)
        }
    }

    /**
     * Add Recipe Function
     * - Get values from add form inputs
     * - Validate both name and instructions
     * - Send POST request to /recipes
     * - Use Bearer token from sessionStorage
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function addRecipe() {
        const recipeName = addRecipeNameField.value.trim();
        const recipeInstructions = addRecipeInstructionsField.value.trim();

            if (recipeName.length < 1 || recipeInstructions.length < 1) {
                //Error: Invalid fields
                alert("Fields must all be filled")
                return;
            }

        const requestBody = { name: recipeName, instructions: recipeInstructions };
        const requestOptions = {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("auth-token")}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        };
        try {
            
            const request = await fetch(`${BASE_URL}/recipes`, requestOptions);

            if (request.ok) {
                // Clear inputs
                addRecipeInstructionsField.value = "";
                addRecipeNameField.value = "";

                //Get new recipes and refresh
                await getRecipes();

            } else {
                console.error("Unexpected response status:", response.status);
                alert("Failed to add recipe")
            }

        } catch (error) {
            console.error('Error:', error)
            alert("Error adding recipe")
        }
    }

    /**
     * Update Recipe Function
     * - Get values from update form inputs
     * - Validate both name and updated instructions
     * - Fetch current recipes to locate the recipe by name
     * - Send PUT request to update it by ID
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function updateRecipe() {
        const recipeName = updateRecipeNameField.value.trim();
        const recipeInstructions = updateRecipeInstructionsField.value.trim();

            if (recipeName.length < 1 || recipeInstructions.length < 1) {
                //Error: Invalid fields
                alert("Fields must all be filled")
                return;
            }

        const requestOptions = {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("auth-token")}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({instructions: recipeInstructions})
        };

        try {

            const searchRequest = await fetch(`${BASE_URL}/recipes?name=${encodeURIComponent(recipeName)}`);

            const recipeToUpdate = await searchRequest.json();

            if (recipeToUpdate.length < 1) {
                alert("Recipe not found");
                return;
            }
            const recipeId = recipeToUpdate[0].id;
            const updateRequest = await fetch(`${BASE_URL}/recipes/${recipeId}`, requestOptions);

            if (updateRequest.ok) {
                // Clear input fields
                updateRecipeNameField.value = "";
                updateRecipeInstructionsField.value = "";

                // Get new recipes and refresh
                await getRecipes();
                
            } else {
                console.error("Unexpected response status:", response.status);
                alert("Failed to update recipe")
            }

        } catch (error) {
            console.error('Error:', error)
            alert("Error updating recipe")
        }
    }

    /**
     * Delete Recipe Function
     * - Get recipe name from delete input
     * - Find matching recipe in list to get its ID
     * - Send DELETE request using recipe ID
     * - On success: refresh the list
     */
    async function deleteRecipe() {
        const recipeName = deleteRecipeNameField.value.trim();

        const requestOptions = {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("auth-token")}`
            },
        };

        try {

            const searchRequest = await fetch(`${BASE_URL}/recipes?name=${encodeURIComponent(recipeName)}`);

            const recipeToDelete = await searchRequest.json();

            if (recipeToDelete.length < 1) {
                alert("Recipe not found");
                return;
            }
            const recipeId = recipeToDelete[0].id;

            const deleteRequest = await fetch(`${BASE_URL}/recipes/${recipeId}`, requestOptions);

            if (deleteRequest.ok) {
                // Clear inputs
                deleteRecipeNameField.value = "";

                // refresh the list
                await getRecipes();

            } else {
                console.error("Unexpected response status:", request.status);
                alert("Unexpected error encountered")
            }
        } catch (error) {
            console.error('Error:', error)
            alert("Failed to delete recipe")
        }
    }

    /**
     * Get Recipes Function
     * - Fetch all recipes from backend
     * - Store in recipes array
     * - Call refreshRecipeList() to display
     */
    async function getRecipes() {

        const requestOptions = {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("auth-token")}`
            },
        };

        try {
            const response = await fetch(`${BASE_URL}/recipes`, requestOptions)

            if(!response.ok){
                alert("Failed to retrieve recipies")
                return;
            }

            recipes = await response.json();

            refreshRecipeList();

        } catch (error) {
            console.error('Error:', error)
            alert("Failed to get recipes")
        }
    }

    /**
     * Refresh Recipe List Function
     * - Clear current list in DOM
     * - Create <li> elements for each recipe with name + instructions
     * - Append to list container
     */
    function refreshRecipeList() {
        //Clear list
        recipeList.innerHTML = "";

        //Create <li> elements and append to list container
        recipes.forEach(item => {
            const li = document.createElement("li");
            li.innerHTML = `${item.name}: ${item.instructions}`;
            recipeList.appendChild(li);
        });
    }

    /**
     * Logout Function
     * - Send POST request to /logout
     * - Use Bearer token from sessionStorage
     * - On success: clear sessionStorage and redirect to login
     * - On failure: alert the user
     */
    async function processLogout() {
        const requestOptions = {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("auth-token")}`
            },
        };

        try {
            const request = await fetch(`${BASE_URL}/logout`, requestOptions)

            if (request.ok) {
                // Clear session storage
                sessionStorage.clear();

                // Send to login page
                location.replace("../login/login-page.html");

            } else {
                console.error("Unexpected request status:", request.status);
                alert("Error attempting logout")
            }
        } catch (error) {
            console.error('Error:', error)
            alert("Error attempting logout")
        }
    }

    function adminLinkDisplayHandler() {
        if (sessionStorage.getItem('is-admin') === "true") {
        adminLink.style.display = "block";
    }
    
    }
    function logoutButtonDisplayHandler() {
        if (sessionStorage.getItem('auth-token')) {
            logoutButton.style.display = "block";
        }
    }
});