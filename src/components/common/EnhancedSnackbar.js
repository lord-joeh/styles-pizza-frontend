import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const EnhancedSnackbar = ({
  open,
  message,
  severity,
  onClose,
  autoHideDuration = 6000,
  anchorOrigin = {
    vertical: 'bottom',
    horizontal: 'center'
  }
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{ width: '100%' }}
        elevation={6}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default EnhancedSnackbar;