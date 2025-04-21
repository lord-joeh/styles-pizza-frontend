import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { loginUser } from '../../services/authService';
import { validateEmail, validatePassword } from '../../utils/validation';
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
  const [passwordStrength, setPasswordStrength] = useState({
    message: '',
    strength: 0,
  });
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
    const emailValidation = validateEmail(formData.email);
    const passwordValidation = validatePassword(formData.password);

    const newErrors = {
      email: emailValidation.message,
      password: passwordValidation.message,
    };

    setErrors(newErrors);
    return emailValidation.isValid && passwordValidation.isValid;
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
      setApiError(error.error || 'Invalid email or password');
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
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
          autoComplete="email"
          disabled={loading}
          aria-label="Email Address"
          InputProps={{
            'aria-describedby': errors.email ? 'email-error' : undefined,
          }}
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
          aria-label="Password"
          InputProps={{
            'aria-describedby': errors.password ? 'password-error' : undefined,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  disabled={loading}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
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
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
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
