import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetPassword } from '../../services/authService';
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
import { validatePassword } from '../../utils/validation';
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

const ResetPassword = ({ token }) => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState({
    text: '',
    isError: false,
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when user types
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setMessage({ text: '', isError: false });
  };

  const validateForm = () => {
    const passwordValidation = validatePassword(formData.password);
    const newErrors = {
      password: passwordValidation.isValid ? '' : passwordValidation.message,
      confirmPassword:
        formData.password === formData.confirmPassword
          ? ''
          : 'Passwords do not match',
    };

    setErrors(newErrors);
    return (
      passwordValidation.isValid &&
      formData.password === formData.confirmPassword
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      await resetPassword(token, formData.password);
      setMessage({
        text: 'Password reset successfully! Redirecting to login...',
        isError: false,
      });
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.error('Reset password error:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to reset password. Please try again.';
      setMessage({
        text: errorMessage,
        isError: true,
      });
      setFormData((prev) => ({
        password: '',
        confirmPassword: '',
      }));
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
        Reset Your Password
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
          label="New Password"
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
                  onClick={togglePasswordVisibility}
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

        <TextField
          fullWidth
          margin="normal"
          label="Confirm New Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          disabled={loading}
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
            'Reset Password'
          )}
        </Button>

        {message.text && (
          <Alert
            severity={message.isError ? 'error' : 'success'}
            sx={{ mt: 2 }}
            onClose={() => setMessage({ text: '', isError: false })}
          >
            {message.text}
          </Alert>
        )}
      </Box>
    </StyledPaper>
  );
};

export default ResetPassword;
