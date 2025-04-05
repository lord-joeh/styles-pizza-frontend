// pizza-frontend/src/components/admin/Dashboard.js
import React from 'react';
import { Container, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

// Moved styled components outside the functional component to prevent recreation on every render
const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  minHeight: '80vh',
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: '#FF5722', // Consistent primary color
  textAlign: 'center',
  marginBottom: theme.spacing(4),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '12px',
}));

const Dashboard = () => {
  return (
    <StyledContainer>
      <StyledTypography variant="h4" component="h1">
        Admin Dashboard
      </StyledTypography>
      <StyledPaper>
        <Typography variant="body1">Welcome to the admin dashboard.</Typography>
        {/* Add more dashboard content here */}
      </StyledPaper>
    </StyledContainer>
  );
};

export default Dashboard;