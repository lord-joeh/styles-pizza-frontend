import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { registerUser, verifyEmail } from '../../services/authService';
import VerifyEmail from '../auth/VerifyEmail';
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
import {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  validateName,
} from '../../utils/validation';
import LinearProgress from '@mui/material/LinearProgress';

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
  const [passwordStrength, setPasswordStrength] = useState(0);
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

    // Update password strength when password changes
    if (name === 'password') {
      const { strength } = validatePassword(value);
      setPasswordStrength(strength * 20); // Convert 0-5 scale to 0-100
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      password: '',
      phone: '',
    };

    // Name validation using utility function
    const nameValidation = validateName(formData.name);
    newErrors.name = nameValidation.message;

    // Email validation using utility function
    const emailValidation = validateEmail(formData.email);
    newErrors.email = emailValidation.message;

    // Password validation using utility function
    const passwordValidation = validatePassword(formData.password);
    newErrors.password = passwordValidation.message;

    // Phone validation using utility function
    const phoneValidation = validatePhoneNumber(formData.phone);
    newErrors.phone = phoneValidation.message;

    setErrors(newErrors);
    return (
      nameValidation.isValid &&
      emailValidation.isValid &&
      passwordValidation.isValid &&
      phoneValidation.isValid
    );
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
      const response = await registerUser({
        ...formData,
        phone: cleanedPhone,
      });
      console.log('Registration successful:', response);
      // Extract verification token and redirect to verify email page
      const verificationToken = response.user.verification_token;
      navigate(`/verify-email/${verificationToken}`, {
        state: {
          email: formData.email,
          token: verificationToken,
          message: response.message || 'Please check your email to verify your account.',
          fromRegistration: true
        },
      });
    } catch (error) {
      console.error('Registration error:', error);
      setApiError(
        error.response?.data?.error?.message || 'Registration failed. Please try again.',
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
          disabled={loading}
          autoComplete="new-password"
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
        {formData.password && (
          <Box sx={{ width: '100%', mt: 1 }}>
            <LinearProgress
              variant="determinate"
              value={passwordStrength}
              sx={{
                height: 8,
                borderRadius: 5,
                backgroundColor: '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  backgroundColor:
                    passwordStrength <= 40
                      ? '#f44336'
                      : passwordStrength <= 60
                      ? '#ff9800'
                      : '#4caf50',
                },
              }}
            />
            <Typography
              variant="caption"
              sx={{
                mt: 0.5,
                display: 'block',
                color:
                  passwordStrength <= 40
                    ? '#f44336'
                    : passwordStrength <= 60
                    ? '#ff9800'
                    : '#4caf50',
              }}
            >
              Password Strength:{' '}
              {passwordStrength <= 40
                ? 'Weak'
                : passwordStrength <= 60
                ? 'Moderate'
                : 'Strong'}
            </Typography>
          </Box>
        )}

        <TextField
          fullWidth
          margin="normal"
          label="Phone Number"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handlePhoneChange}
          error={!!errors.phone}
          helperText={errors.phone}
          disabled={loading}
          autoComplete="tel"
          aria-label="Phone Number"
          placeholder="(123) 456-7890"
          inputProps={{
            maxLength: 14,
          }}
          InputProps={{
            'aria-describedby': errors.phone ? 'phone-error' : undefined,
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
