import api from '../utils/api';

export const getIngredients = async () => {
  try {
    const response = await api.get('/ingredients');
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.error ||
      error.message ||
      'Failed to fetch ingredients. Please try again';
    throw new Error(message);
  }
};

export const createIngredient = async (ingredient) => {
  try {
    if (!ingredient?.name?.trim()) {
      throw new Error('Name is required');
    }
    const response = await api.post('/ingredients', ingredient);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.error ||
      error.message ||
      'Failed to create ingredient. Please try again';
    throw new Error(message);
  }
};

export const updateIngredient = async (id, updates) => {
  try {
    if (!id) throw new Error('Ingredient ID is required');
    if (!updates?.name?.trim()) throw new Error('Name is required');

    const response = await api.put(`/ingredients/${id}`, updates);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.error ||
      error.message ||
      'Failed to update ingredient. Please try again.';
    throw new Error(message);
  }
};

export const deleteIngredient = async (id) => {
  try {
    if (!id) throw new Error('Ingredient ID is required');

    const response = await api.delete(`/ingredients/${id}`);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.error ||
      error.message ||
      'Failed to delete ingredient. Please try again.';
    throw new Error(message);
  }
};
