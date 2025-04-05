import React from 'react';
import PizzaList from '../components/customer/PizzaList';
import { Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const CustomerDashboard = () => {
    // Styled Components
    const StyledPaper = styled(Paper)(({ theme }) => ({
        padding: theme.spacing(3),
        marginTop: theme.spacing(4),
        borderRadius: '12px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: theme.palette.background.paper,
    }));

    const StyledTitle = styled(Typography)(({ theme }) => ({
        marginBottom: theme.spacing(3),
        textAlign: 'center',
        color: '#FF5722', // Consistent theming
    }));

    return (
        <StyledPaper>
            <StyledTitle variant="h5" component="h2">
                Customer Dashboard
            </StyledTitle>
            <PizzaList />
        </StyledPaper>
    );
};

export default CustomerDashboard;
