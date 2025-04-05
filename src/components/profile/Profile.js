import React, { useState, useEffect, useContext, useCallback } from 'react';
import { getProfile, updateProfile } from '../../services/authService';
import { AuthContext } from '../../context/AuthContext';
import {
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Box,
  Avatar,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Person, Email, Phone, Save, Undo } from '@mui/icons-material';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  margin: theme.spacing(4, 'auto'),
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  backgroundColor: theme.palette.background.paper,
  maxWidth: 500,
}));

const ProfileHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: theme.palette.divider,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const Profile = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [initialData, setInitialData] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [status, setStatus] = useState({
    isLoading: true,
    isSubmitting: false,
    error: null,
    success: null,
  });
  const { login, user: authUser } = useContext(AuthContext);

  const fetchProfile = useCallback(async (signal) => {
    try {
      const response = await getProfile({ signal });
      const userData = {
        name: response.user.name,
        phone: response.user.phone || '',
        email: response.user.email,
      };
      setInitialData(userData);
      setFormData(userData);
      setStatus((prev) => ({ ...prev, isLoading: false }));
    } catch (err) {
      if (err.name !== 'AbortError') {
        const errorMessage =
          err.response?.data?.message ||
          'Failed to load profile. Please try again later.';
        setStatus((prev) => ({
          ...prev,
          error: errorMessage,
          isLoading: false,
        }));
      }
    }
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    fetchProfile(abortController.signal);
    return () => abortController.abort();
  }, [fetchProfile]);

  useEffect(() => {
    if (status.error || status.success) {
      const timer = setTimeout(() => {
        setStatus((prev) => ({ ...prev, error: null, success: null }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status.error, status.success]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus((prev) => ({
      ...prev,
      error: null,
      success: null,
      isSubmitting: true,
    }));

    try {
      const response = await updateProfile({
        name: formData.name,
        phone: formData.phone,
      });

      // Merge updated data with existing authentication state
      const updatedUser = {
        ...authUser,
        ...response.user,
        token: authUser.token, // Maintain existing token
      };

      login(updatedUser);

      // Update form and initial data with merged values
      const mergedFormData = {
        name: updatedUser.name,
        phone: updatedUser.phone || '',
        email: updatedUser.email,
      };

      setFormData(mergedFormData);
      setInitialData(mergedFormData);

      setStatus((prev) => ({
        ...prev,
        success: 'Profile updated successfully!',
        isSubmitting: false,
      }));
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        'Failed to update profile. Please try again.';
      setStatus((prev) => ({
        ...prev,
        error: errorMessage,
        isSubmitting: false,
      }));
    }
  };

  const handleCancel = () => {
    setFormData(initialData);
    setStatus((prev) => ({ ...prev, error: null, success: null }));
  };

  if (status.isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  const isFormDirty = JSON.stringify(formData) !== JSON.stringify(initialData);

  return (
    <StyledPaper component="main">
      <ProfileHeader>
        <StyledAvatar>
          <Person sx={{ fontSize: 40 }} />
        </StyledAvatar>
        <Typography variant="h4" component="h1" gutterBottom>
          My Profile
        </Typography>
      </ProfileHeader>

      <Box component="form" onSubmit={handleSubmit}>
        <StyledTextField
          fullWidth
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          variant="outlined"
          required
          disabled={status.isSubmitting}
          inputProps={{ maxLength: 50 }}
          InputProps={{
            startAdornment: <Person color="action" sx={{ mr: 1 }} />,
          }}
        />

        <StyledTextField
          fullWidth
          label="Phone Number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          variant="outlined"
          disabled={status.isSubmitting}
          inputProps={{
            maxLength: 20,
            pattern: '^[+]?[(]?[0-9]{1,4}[)]?[\\s./0-9-]*$',
          }}
          InputProps={{
            startAdornment: <Phone color="action" sx={{ mr: 1 }} />,
          }}
        />

        <StyledTextField
          fullWidth
          label="Email Address"
          name="email"
          value={formData.email}
          variant="outlined"
          disabled
          InputProps={{
            startAdornment: <Email color="action" sx={{ mr: 1 }} />,
          }}
        />

        {status.error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {status.error}
          </Alert>
        )}

        {status.success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {status.success}
          </Alert>
        )}

        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Button
            type="submit"
            variant="contained"
            startIcon={
              status.isSubmitting ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <Save />
              )
            }
            disabled={status.isSubmitting || !isFormDirty}
            sx={{ flex: 1 }}
          >
            {status.isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>

          <Button
            variant="outlined"
            startIcon={<Undo />}
            onClick={handleCancel}
            disabled={status.isSubmitting || !isFormDirty}
            sx={{ flex: 1 }}
          >
            Cancel
          </Button>
        </Stack>
      </Box>
    </StyledPaper>
  );
};

export default Profile;
