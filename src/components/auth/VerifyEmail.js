import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyEmail } from '../../services/authService';
import {
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Box,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  margin: theme.spacing(8, 'auto'),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: 500,
  borderRadius: 12,
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
    margin: theme.spacing(4, 2),
    width: 'auto',
  },
}));

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState({
    loading: true,
    message: '',
    isError: false,
    retryAvailable: false,
  });
  const navigate = useNavigate();

  const verifyToken = async () => {
    try {
      setStatus((prev) => ({ ...prev, loading: true }));
      await verifyEmail(token);
      setStatus({
        loading: false,
        message: 'Email verified successfully! Redirecting to login...',
        isError: false,
        retryAvailable: false,
      });
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      console.error('Email verification error:', err);
      setStatus({
        loading: false,
        message:
          err.response?.data?.message ||
          'Email verification failed. The link may be invalid or expired.',
        isError: true,
        retryAvailable: true,
      });
    }
  };

  useEffect(() => {
    if (!token) {
      setStatus({
        loading: false,
        message: 'No verification token provided',
        isError: true,
        retryAvailable: false,
      });
      return;
    }
    verifyToken();
  }, [token]);

  const handleRetry = () => {
    verifyToken();
  };

  const handleRedirect = () => {
    navigate(status.isError ? '/' : '/login');
  };

  return (
    <StyledPaper elevation={3} aria-live="polite">
      {status.loading ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            minHeight: 200,
            justifyContent: 'center',
          }}
        >
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" color="text.secondary">
            Verifying your email...
          </Typography>
        </Box>
      ) : (
        <>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 600,
              color: status.isError ? 'error.main' : 'success.main',
              textAlign: 'center',
              mb: 2,
            }}
          >
            {status.isError ? 'Verification Failed' : 'Email Verified!'}
          </Typography>

          <Alert
            severity={status.isError ? 'error' : 'success'}
            sx={{
              width: '100%',
              mb: 3,
              '& .MuiAlert-message': {
                width: '100%',
              },
            }}
          >
            <Typography variant="body1" gutterBottom>
              {status.message}
            </Typography>
            {!status.isError && (
              <Typography variant="body2">
                You will be redirected automatically...
              </Typography>
            )}
          </Alert>

          <Box sx={{ display: 'flex', gap: 2 }}>
            {status.retryAvailable && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleRetry}
                sx={{ px: 4 }}
              >
                Try Again
              </Button>
            )}
            <Button
              variant={status.retryAvailable ? 'outlined' : 'contained'}
              color={status.isError ? 'error' : 'primary'}
              onClick={handleRedirect}
              sx={{ px: 4 }}
            >
              {status.isError ? 'Go to Home' : 'Go to Login Now'}
            </Button>
          </Box>
        </>
      )}
    </StyledPaper>
  );
};

export default VerifyEmail;
