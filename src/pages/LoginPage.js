import React from 'react';
import Login from '../components/auth/Login';
import { styled } from '@mui/material/styles';
import { Paper } from '@mui/material';

const LoginPage = () => {
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
            <Login />
        </StyledPaper>
    );
};

export default LoginPage;
