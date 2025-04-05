import React from 'react';
import { Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const HomePage = () => {
    // Styled Components
    const StyledPaper = styled(Paper)(({ theme }) => ({
        padding: theme.spacing(4),
        marginTop: theme.spacing(4),
        borderRadius: '12px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: theme.palette.background.paper,
        textAlign: 'center',
    }));

    const StyledTitle = styled(Typography)(({ theme }) => ({
        fontWeight: 'bold',
        fontSize: '2.5rem',
        color: '#FF5722', // Consistent theming
        marginBottom: theme.spacing(2),
    }));

    const StyledParagraph = styled(Typography)(({ theme }) => ({
        fontSize: '1.1rem',
        color: theme.palette.text.secondary,
        marginTop: theme.spacing(2),
    }));

    return (
        <StyledPaper>
            <StyledTitle variant="h1" component="h1">
                Welcome to lord styles Pizza Order
            </StyledTitle>
            <StyledParagraph variant="body1">
                Order your favorite pizzas online!
            </StyledParagraph>
        </StyledPaper>
    );
};

export default HomePage;
