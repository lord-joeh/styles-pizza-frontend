import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  TextField,
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Refresh } from '@mui/icons-material';
import { getIngredients } from '../../services/ingredientService';

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: theme.palette.grey[400] },
    '&:hover fieldset': { borderColor: theme.palette.primary.main },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      boxShadow: `0 0 0 2px ${theme.palette.primary.light}`,
    },
  },
}));

const AddPizzaForm = ({
  pizza = null,
  setPizza,
  onSubmit,
  onCancel,
  loading = false,
  error = null,
  isEdit = false,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    size: '',
    image: '',
    ingredients: [],
  });
  const [imagePreview, setImagePreview] = useState('');
  const [availableIngredients, setAvailableIngredients] = useState([]);
  const [ingredientsLoading, setIngredientsLoading] = useState(true);
  const [ingredientsError, setIngredientsError] = useState(null);

  const sizeOptions = ['small', 'medium', 'large'];
  const minPrice = 10;
  const maxPrice = 1000;

  useEffect(() => {
    const initialData = pizza || {
      name: '',
      description: '',
      price: '',
      size: '',
      image: '',
      ingredients: [],
    };
    setFormData(initialData);
    setImagePreview(initialData.image || '');
  }, [pizza]);

  const fetchIngredients = useCallback(async () => {
    try {
      setIngredientsError(null);
      setIngredientsLoading(true);
      const { data } = await getIngredients();
      setAvailableIngredients(data || []);
    } catch (err) {
      setIngredientsError(
        err.response?.data?.error || 'Failed to load ingredients',
      );
    } finally {
      setIngredientsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIngredients();
  }, [fetchIngredients]);

  const handleChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    setPizza(newData);
  };

  const handleImageChange = (e) => {
    const url = e.target.value;
    handleChange('image', url);
    if (url) setImagePreview(url);
  };

  const handleIngredientChange = (event) => {
    handleChange('ingredients', event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: parseFloat(formData.price),
    });
  };

  const isValidPrice = () => {
    const price = parseFloat(formData.price);
    return !isNaN(price) && price >= minPrice && price <= maxPrice;
  };

  const isFormValid = () => {
    return (
      formData.name.trim() &&
      isValidPrice() &&
      formData.size &&
      formData.ingredients.length > 0
    );
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontWeight: 'bold', color: 'primary.main' }}
      >
        {isEdit ? 'Edit Pizza' : 'Create New Pizza'}
      </Typography>

      {(error || ingredientsError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || ingredientsError}
          {ingredientsError && (
            <Button
              color="inherit"
              size="small"
              onClick={fetchIngredients}
              endIcon={<Refresh fontSize="small" />}
              sx={{ ml: 2 }}
            >
              Retry
            </Button>
          )}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <StyledTextField
          label="Name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          required
          error={!formData.name.trim()}
          helperText={!formData.name.trim() && 'Name is required'}
        />

        <StyledTextField
          label="Description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          multiline
          rows={3}
        />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <StyledTextField
            label="Price"
            type="number"
            value={formData.price}
            onChange={(e) => handleChange('price', e.target.value)}
            required
            inputProps={{ 
              min: minPrice, 
              max: maxPrice, 
              step: 0.01 
            }}
            error={!isValidPrice()}
            helperText={
              !isValidPrice() && 
              `Price must be between GHS ${minPrice} and GHS ${maxPrice}`
            }
            sx={{ flex: 1 }}
          />

          <FormControl fullWidth sx={{ flex: 1 }}>
            <InputLabel>Size</InputLabel>
            <Select
              value={formData.size}
              onChange={(e) => handleChange('size', e.target.value)}
              label="Size"
              required
            >
              {sizeOptions.map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <StyledTextField
          label="Image URL"
          value={formData.image}
          onChange={handleImageChange}
          onBlur={handleImageChange}
        />

        {imagePreview && (
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Avatar
              src={imagePreview}
              variant="rounded"
              sx={{ width: 200, height: 200 }}
              imgProps={{ onError: () => setImagePreview('') }}
            />
            <Button
              size="small"
              onClick={() => setImagePreview(formData.image)}
              sx={{ alignSelf: 'center' }}
            >
              Reload Image
            </Button>
          </Box>
        )}

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Ingredients</InputLabel>
          <Select
            multiple
            disabled={ingredientsLoading}
            value={formData.ingredients}
            onChange={handleIngredientChange}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((id) => {
                  const ingredient = availableIngredients.find(
                    (ing) => ing.id === id,
                  );
                  return (
                    <Chip 
                      key={id} 
                      label={ingredient?.name || 'Unknown'}
                      color="primary"
                      size="small"
                    />
                  );
                })}
              </Box>
            )}
            required
            error={formData.ingredients.length === 0}
          >
            {ingredientsLoading ? (
              <MenuItem disabled>
                <CircularProgress size={20} sx={{ mr: 2 }} />
                Loading ingredients...
              </MenuItem>
            ) : (
              availableIngredients.map((ingredient) => (
                <MenuItem key={ingredient.id} value={ingredient.id}>
                  <Checkbox
                    checked={formData.ingredients.includes(ingredient.id)}
                  />
                  <ListItemText 
                    primary={ingredient.name}
                    secondary={ingredient.description}
                  />
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>

        <Box
          sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}
        >
          <Button
            onClick={onCancel}
            variant="outlined"
            color="primary"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || !isFormValid()}
            sx={{ minWidth: 120 }}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : isEdit ? (
              'Update'
            ) : (
              'Create'
            )}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

AddPizzaForm.propTypes = {
  pizza: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    size: PropTypes.string,
    image: PropTypes.string,
    ingredients: PropTypes.arrayOf(PropTypes.string),
    id: PropTypes.string,
  }),
  setPizza: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  isEdit: PropTypes.bool,
};

export default AddPizzaForm;