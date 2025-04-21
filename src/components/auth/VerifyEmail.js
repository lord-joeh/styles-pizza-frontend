import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { verifyEmail, resendVerification } from '../../services/authService';
import {
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Box,
  Button,
  Container,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import VerifiedIcon from '@mui/icons-material/Verified';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

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
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || '');
  const [status, setStatus] = useState({
    loading: true,
    message: '',
    isError: false,
    canResend: false,
    verificationAttempts: 0,
    verificationCompleted: false,
  });
  const maxVerificationAttempts = 3;

  const verifyToken = async () => {
    try {
      setStatus((prev) => ({ ...prev, loading: true }));
      await verifyEmail(token);
      setStatus({
        loading: false,
        message: 'Email verified successfully! Redirecting to login...',
        isError: false,
        canResend: false,
        verificationCompleted: true,
      });
      setTimeout(() => navigate('/login', { state: { email } }), 3000);
    } catch (err) {
      console.error('Email verification error:', err);
      setStatus({
        loading: false,
        message:
          err.response?.data?.error ||
          'Email verification failed. The link may be invalid or expired.',
        isError: true,
        canResend: true,
      });
    }
  };

  const handleResend = async () => {
    try {
      if (!email) {
        setStatus((prev) => ({
          ...prev,
          message: 'No email available for resending verification',
          isError: true,
        }));
        return;
      }

      if (status.verificationAttempts >= maxVerificationAttempts) {
        setStatus((prev) => ({
          ...prev,
          message:
            'Maximum verification attempts reached. Please contact support.',
          isError: true,
          canResend: false,
        }));
        return;
      }

      setStatus((prev) => ({
        ...prev,
        loading: true,
        verificationAttempts: prev.verificationAttempts + 1,
      }));
      await resendVerification(email);
      setStatus((prev) => ({
        loading: false,
        message: `New verification email sent successfully! (${
          maxVerificationAttempts - prev.verificationAttempts
        } attempts remaining)`,
        isError: false,
        canResend: prev.verificationAttempts < maxVerificationAttempts,
        verificationAttempts: prev.verificationAttempts,
      }));
    } catch (err) {
      setStatus({
        loading: false,
        message:
          err.response?.data?.error ||
          'Failed to resend verification email. Please try again later.',
        isError: true,
        canResend: true,
      });
    }
  };

  useEffect(() => {
    if (!token) {
      setStatus({
        loading: false,
        message: 'No verification token provided',
        isError: true,
        canResend: !!email,
        verificationCompleted: false,
      });
      return;
    }
    if (!status.verificationCompleted) {
      verifyToken();
    }
  }, [token, status.verificationCompleted]);

  return (
    <Container maxWidth="sm">
      <StyledPaper elevation={3} aria-live="polite">
        {status.loading ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 4,
            }}
          >
            <CircularProgress size={60} thickness={4} sx={{ mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Verifying your email...
            </Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              {status.isError ? (
                <ErrorOutlineIcon color="error" sx={{ fontSize: 60, mb: 1 }} />
              ) : (
                <VerifiedIcon color="success" sx={{ fontSize: 60, mb: 1 }} />
              )}
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  color: status.isError ? 'error.main' : 'success.main',
                }}
              >
                {status.isError ? 'Verification Failed' : 'Email Verified!'}
              </Typography>
            </Box>

            <Alert
              severity={status.isError ? 'error' : 'success'}
              sx={{ width: '100%', mb: 3 }}
              variant="filled"
            >
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {status.message}
              </Typography>
              {!status.isError && (
                <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                  You will be redirected automatically...
                </Typography>
              )}
              {status.verificationAttempts > 0 && status.canResend && (
                <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                  Remaining attempts:{' '}
                  {maxVerificationAttempts - status.verificationAttempts}
                </Typography>
              )}
            </Alert>

            <Box
              sx={{
                display: 'flex',
                gap: 2,
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {status.canResend && email && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleResend}
                  sx={{ minWidth: 200 }}
                >
                  Resend Verification
                </Button>
              )}
              <Button
                variant={status.canResend ? 'outlined' : 'contained'}
                color={status.isError ? 'error' : 'primary'}
                onClick={() => navigate(status.isError ? '/' : '/login')}
                sx={{ minWidth: 200 }}
              >
                {status.isError ? 'Go to Home' : 'Go to Login Now'}
              </Button>
            </Box>
          </>
        )}
      </StyledPaper>
    </Container>
  );
};

export default VerifyEmail;
