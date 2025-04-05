import React, { useState } from 'react';
import { forgotPassword } from '../../services/authService';
import {
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';
import { validateEmail } from '../../utils/validation';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  margin: theme.spacing(8, 'auto'),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: 450,
  borderRadius: 12,
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
    margin: theme.spacing(4, 2),
    width: 'auto',
  },
}));

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: '',
  });
  const [errors, setErrors] = useState({
    email: '',
  });
  const [apiResponse, setApiResponse] = useState({
    message: '',
    isError: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setApiResponse((prev) => ({ ...prev, message: '' }));
  };

  const validateForm = () => {
    const emailValidation = validateEmail(formData.email);
    const newErrors = {
      email: emailValidation.isValid ? '' : emailValidation.message,
    };
    setErrors(newErrors);
    return emailValidation.isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await forgotPassword(formData.email);
      setApiResponse({
        message: 'Password reset email sent. Please check your inbox.',
        isError: false,
      });
      setFormData({ email: '' });
    } catch (error) {
      console.error('Forgot password error:', error);
      setApiResponse({
        message:
          error.response?.data?.message ||
          error.message ||
          'Failed to send reset email. Please try again.',
        isError: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledPaper elevation={3}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 600,
          color: 'primary.main',
          textAlign: 'center',
          mb: 3,
        }}
      >
        Forgot Password
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
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
          disabled={loading}
          autoComplete="email"
          autoFocus
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          sx={{
            mt: 3,
            py: 1.5,
            backgroundColor: '#FF5722',
            '&:hover': { backgroundColor: '#E64A19' },
          }}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Send Reset Link'
          )}
        </Button>

        {apiResponse.message && (
          <Alert
            severity={apiResponse.isError ? 'error' : 'success'}
            sx={{ mt: 2 }}
            onClose={() => setApiResponse({ message: '', isError: false })}
          >
            {apiResponse.message}
          </Alert>
        )}
      </Box>
    </StyledPaper>
  );
};

export default ForgotPassword;
