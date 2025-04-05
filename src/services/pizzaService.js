import api from '../utils/api';

/**
 * Fetches all pizzas from the API
 * @param {Object} params - Optional query parameters (e.g., { vegetarian: true })
 * @returns {Promise<Array>} Array of pizza objects
 * @throws {Error} If the request fails
 */
export const getPizzas = async (params = {}) => {
  try {
    const response = await api.get('/pizzas', { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch pizzas');
  }
};

/**
 * Gets a specific pizza by ID
 * @param {string|number} id - ID of the pizza to retrieve
 * @returns {Promise<Object>} Pizza object
 * @throws {Error} If pizza not found or request fails
 */
export const getPizzaById = async (id) => {
  try {
    if (!id) throw new Error('Pizza ID is required');
    // Convert id to number for the backend
    const response = await api.get(`/pizzas/${Number(id)}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch pizza');
  }
};

/**
 * Creates a new pizza
 * @param {Object} pizza - Pizza data to create
 * @param {string} pizza.name - Name of the pizza
 * @param {string} pizza.description - Description of the pizza
 * @param {number} pizza.price - Price of the pizza
 * @param {string} pizza.size - Size of the pizza
 * @param {string} pizza.image - Image URL of the pizza
 * @param {Array} pizza.ingredients - Array of ingredient IDs
 * @returns {Promise<Object>} Created pizza data
 * @throws {Error} If creation fails or validation fails
 */
export const createPizza = async (pizza) => {
  try {
    // Validate required fields: name, price, and size
    if (!pizza?.name || !pizza?.price || !pizza?.size) {
      throw new Error('Name, price, and size are required');
    }
    // Ensure the price is a number before sending the payload
    const payload = {
      ...pizza,
      price: Number(pizza.price),
    };
    const response = await api.post('/pizzas', payload);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || error.message || 'Failed to create pizza',
    );
  }
};

/**
 * Updates an existing pizza
 * @param {string|number} id - ID of the pizza to update
 * @param {Object} updates - Fields to update
 * @param {string} updates.name - Name of the pizza
 * @param {string} updates.description - Description of the pizza
 * @param {number} updates.price - Price of the pizza
 * @param {string} updates.size - Size of the pizza
 * @param {string} updates.image - Image URL of the pizza
 * @param {Array} updates.ingredients - Array of ingredient IDs
 * @returns {Promise<Object>} Updated pizza data
 * @throws {Error} If update fails
 */
export const updatePizza = async (id, updates) => {
  try {
    const payload = {
      ...updates,
      id: Number(id), // Ensure it's an integer
      price: updates.price ? Number(updates.price) : undefined,
      image: String(updates.image), // Ensure it's a string
      ingredients:
        updates.ingredients?.map((ingredient) => ingredient.id) || [], // Extract only the IDs
    };

    const response = await api.put(`/pizzas/${id}`, payload);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to update pizza');
  }
};

/**
 * Deletes a pizza
 * @param {string|number} id - ID of the pizza to delete
 * @returns {Promise<Object>} Confirmation message
 * @throws {Error} If deletion fails
 */
export const deletePizza = async (id) => {
  try {
    if (!id) throw new Error('Pizza ID is required');
    const response = await api.delete(`/pizzas/${Number(id)}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to delete pizza');
  }
};
