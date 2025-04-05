import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { registerUser } from '../../services/authService';
import {
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Box,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(8),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '12px',
  backgroundColor: theme.palette.background.paper,
  maxWidth: 450,
  marginLeft: 'auto',
  marginRight: 'auto',
  [theme.breakpoints.down('sm')]: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(2),
    width: '90%',
  },
}));

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setApiError('');
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: '',
      email: '',
      password: '',
      phone: '',
    };

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    }

    // Phone validation (accepts digits only, 10 digits required)
    const cleanedPhone = formData.phone.replace(/\D/g, '');
    if (!cleanedPhone) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (cleanedPhone.length !== 10) {
      newErrors.phone = 'Phone number must be 10 digits';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handlePhoneChange = (e) => {
    const input = e.target.value.replace(/\D/g, ''); // Remove all non-digit characters
    const formattedPhone = formatPhoneNumber(input);
    setFormData((prev) => ({ ...prev, phone: formattedPhone }));
    setErrors((prev) => ({ ...prev, phone: '' }));
    setApiError('');
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return '';

    // Format as (XXX) XXX-XXXX as user types
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);

    if (match) {
      let formatted = '';
      if (match[1]) formatted += `(${match[1]}`;
      if (match[2]) formatted += `) ${match[2]}`;
      if (match[3]) formatted += `-${match[3]}`;
      return formatted;
    }
    return phone;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setApiError('');

    try {
      const cleanedPhone = formData.phone.replace(/\D/g, '');
      const userData = await registerUser({
        ...formData,
        phone: cleanedPhone,
      });

      await login(userData);
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      setApiError(
        error.response?.data?.message ||
          'Registration failed. Please try again.',
      );
      setFormData((prev) => ({
        ...prev,
        password: '', // Clear password on failure
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledPaper>
      <Typography
        variant="h5"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          color: '#FF5722',
          textAlign: 'center',
          mb: 3,
        }}
      >
        Create Your Account
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ width: '100%' }}
        noValidate
      >
        <TextField
          fullWidth
          margin="normal"
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
          disabled={loading}
          autoComplete="name"
        />

        <TextField
          fullWidth
          margin="normal"
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
          disabled={loading}
          autoComplete="email"
        />

        <TextField
          fullWidth
          margin="normal"
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
          disabled={loading}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  disabled={loading}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Phone Number"
          name="phone"
          value={formData.phone}
          onChange={handlePhoneChange}
          error={!!errors.phone}
          helperText={errors.phone}
          disabled={loading}
          placeholder="(123) 456-7890"
          inputProps={{
            maxLength: 14, // (123) 456-7890 is 14 characters
          }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            mb: 2,
            backgroundColor: '#FF5722',
            '&:hover': { backgroundColor: '#E64A19' },
            height: '48px',
          }}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Register'
          )}
        </Button>

        {apiError && (
          <Alert
            severity="error"
            sx={{ mt: 2 }}
            onClose={() => setApiError('')}
          >
            {apiError}
          </Alert>
        )}
      </Box>
    </StyledPaper>
  );
};

export default Register;
