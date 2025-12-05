const BASEURL = "https://www.themealdb.com/api/json/v1/1";

export const MealApi = {

    //by name
    searchMealByName: async (query) => {
        try {
            const response = await fetch(`${BASEURL}/search.php?s=${encodeURIComponent(query)}`);

            if (response.ok) {
                const data = await response.json();
                return data.meals || [];
            } else {
                throw new Error("Failed to fetch meals");
            }
        } catch (error) {
            console.error("Error fetching meals:", error);
            throw error;
        }
    },

    //by id
    searchMealById: async (id) => {
        try {
            const response = await fetch(`${BASEURL}/lookup.php?i=${id}`);
            if (response.ok) {
                const data = await response.json();
                return data.meals[0];
            } else {
                throw new Error("Failed to fetch meal details");
            }
        } catch (error) {

        }
    },

    //random
    getRandomMeal: async (count = 6) => {
        try {
            const response = await fetch(`${BASEURL}/random.php`);
            if (response.ok) {
                const data = await response.json();
                return data.meals[0];
            } else {
                throw new Error("Failed to fetch random meal");
            }
        } catch (error) {
            console.error("Error fetching random meal:", error);
            throw error;
        }

    },

    //categories
    getCategories: async () => {
        try {
            const response = await fetch(`${BASEURL}/categories.php`);
            if (response.ok){
                const data = await response.json();
                return data.categories;
                } else {
                throw new Error("Failed to fetch categories");
            }
        } catch (error) {
            console.error("Error fetching random meal:", error);
            throw error;
        }
    },

    //filter by ingredient

    filterByIngredient: async (ingredient) => {
        try {
            const response = await fetch(`${BASEURL}/filter.php?i=${ingredient}`);
            if(response.ok){
                const data = await response.json();
                return data.meals;
            } else {
                throw new Error("Failed to fetch meals by ingredient");
            }
        } catch (error) {
            console.error("Error fetching random meal:", error);
            throw error;
        }
    },

    //filterbycategory
    filterbycategory: async (category) => {
        try {
            const response = await fetch(`${BASEURL}/filter.php?c=${category}`);
            if(response.ok){
                const data = await response.json();
                return data.meals;
            } else {
                throw new Error("Failed to fetch meals by category");
            }
        } catch (error) {
            console.error("Error fetching random meal:", error);
            throw error;
        }
    }
    

}