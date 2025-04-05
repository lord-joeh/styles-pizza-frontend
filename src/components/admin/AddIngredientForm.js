import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: theme.palette.grey[400],
      transition: theme.transitions.create('border-color'),
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      boxShadow: `0 0 0 2px ${theme.palette.primary.light}`,
    },
  },
  '& .MuiFormHelperText-root': {
    marginTop: theme.spacing(0.5),
  },
}));

const AddIngredientForm = ({
  initialIngredient = { name: '', description: '' },
  onSubmit,
  onCancel,
  loading = false,
  error = null,
}) => {
  const [ingredient, setIngredient] = useState(initialIngredient);
  const [errors, setErrors] = useState({ name: '', description: '' });
  const [touched, setTouched] = useState({ name: false, description: false });
  const previousIngredient = useRef(initialIngredient);

  useEffect(() => {
    if (
      JSON.stringify(previousIngredient.current) !==
      JSON.stringify(initialIngredient)
    ) {
      setIngredient(initialIngredient);
      setErrors({ name: '', description: '' });
      setTouched({ name: false, description: false });
      previousIngredient.current = initialIngredient;
    }
  }, [initialIngredient]);

  const validateField = useCallback((name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.length > 50) return 'Maximum 50 characters';
        return '';
      case 'description':
        if (value.length > 200) return 'Maximum 200 characters';
        return '';
      default:
        return '';
    }
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {
      name: validateField('name', ingredient.name),
      description: validateField('description', ingredient.description),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  }, [ingredient, validateField]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ name: true, description: true });
    if (validateForm()) {
      onSubmit(ingredient);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIngredient((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleCancel = () => {
    setIngredient(initialIngredient);
    setErrors({ name: '', description: '' });
    setTouched({ name: false, description: false });
    onCancel();
  };

  const isFormValid = () => {
    return !errors.name && !errors.description && ingredient.name.trim();
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontWeight: 'bold', color: 'primary.main' }}
        id="form-title"
      >
        {initialIngredient.id ? 'Edit Ingredient' : 'Add New Ingredient'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} aria-live="polite">
          {error}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
        aria-labelledby="form-title"
      >
        <StyledTextField
          label="Name *"
          name="name"
          value={ingredient.name}
          onChange={handleChange}
          onBlur={handleBlur}
          fullWidth
          required
          error={touched.name && !!errors.name}
          helperText={
            (touched.name && errors.name) ||
            `${ingredient.name.length}/50 characters`
          }
          inputProps={{
            maxLength: 50,
            'aria-required': 'true',
            'aria-describedby': 'name-error',
          }}
          autoFocus
          disabled={loading}
        />

        <StyledTextField
          label="Description"
          name="description"
          value={ingredient.description}
          onChange={handleChange}
          onBlur={handleBlur}
          fullWidth
          multiline
          rows={3}
          error={touched.description && !!errors.description}
          helperText={
            (touched.description && errors.description) ||
            `${ingredient.description.length}/200 characters`
          }
          inputProps={{
            maxLength: 200,
            'aria-describedby': 'description-error',
          }}
          disabled={loading}
        />

        <Box display="flex" gap={2} justifyContent="flex-end">
          <Button
            onClick={handleCancel}
            variant="outlined"
            color="primary"
            disabled={loading}
            aria-label="Cancel"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || !isFormValid()}
            sx={{
              minWidth: 120,
              '&.Mui-disabled': {
                backgroundColor: 'action.disabledBackground',
                color: 'text.disabled',
              },
            }}
            aria-label={
              initialIngredient.id ? 'Update ingredient' : 'Save ingredient'
            }
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : initialIngredient.id ? (
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

AddIngredientForm.propTypes = {
  initialIngredient: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
};

export default AddIngredientForm;
