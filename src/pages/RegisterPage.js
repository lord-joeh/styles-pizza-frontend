import React from 'react';
import Register from '../components/auth/Register';
import { styled } from '@mui/material/styles';
import { Paper } from '@mui/material';

const RegisterPage = () => {
    // Styled Components
      const StyledPaper = styled(Paper)(({ theme }) => ({
        padding: theme.spacing(3),
        marginTop: theme.spacing(4),
        borderRadius: '12px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: theme.palette.background.paper,
         maxWidth: 400, // Added a max width for the form
        margin: '0 auto', // Center the form
    }));

    return (
        <StyledPaper>
            <Register />
        </StyledPaper>
    );
};

export default RegisterPage;
