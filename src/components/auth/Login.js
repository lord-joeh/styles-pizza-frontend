import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { loginUser } from '../../services/authService';
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

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '', password: '' };

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Crucial: prevent default form submission
    if (!validateForm()) return;

    setLoading(true);
    setApiError('');

    try {
      const userData = await loginUser(formData.email, formData.password);
      await login(userData); // Wait for context login to complete
      navigate(userData.isAdmin ? '/admin' : '/');
    } catch (error) {
      console.error('Login error:', error);
      setApiError(error.message || 'Invalid email or password');
      setFormData((prev) => ({ ...prev, password: '' }));
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
        Login to Your Account
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
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
          autoComplete="email"
          disabled={loading}
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
          autoComplete="current-password"
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
          {loading ? <CircularProgress size={24} color="inherit"  /> : 'Sign In'}

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

export default Login;
