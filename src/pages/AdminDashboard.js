import React from 'react';
import { Grid, Container, Typography } from '@mui/material';
import ManagementCard from '../components/admin/ManagementCard';
import {
  LocalPizza as PizzaIcon,
  LocalDining as IngredientIcon,
  ListAlt as OrderIcon,
  People as UserIcon
} from '@mui/icons-material';

const AdminDashboard = () => {
  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Dashboard Overview
      </Typography>

      <Grid container spacing={4}>
        {/* Pizzas Management Card */}
        <Grid item xs={12} md={6} lg={4}>
          <ManagementCard
            title="Pizzas Management"
            icon={<PizzaIcon fontSize="large" color="primary" />}
            actions={[
              { label: 'View Pizza Menu', path: '/admin/pizzas' },
              { label: 'Add New Pizza', path: '/admin/pizzas/new' }
            ]}
          />
        </Grid>

        {/* Ingredients Management Card */}
        <Grid item xs={12} md={6} lg={4}>
          <ManagementCard
            title="Ingredients Management"
            icon={<IngredientIcon fontSize="large" color="secondary" />}
            actions={[
              { label: 'Manage Ingredients', path: '/admin/ingredients' },
              { label: 'Add New Ingredient', path: '/admin/ingredients/new' }
            ]}
          />
        </Grid>

        {/* Orders Management Card */}
        <Grid item xs={12} md={6} lg={4}>
          <ManagementCard
            title="Orders Management"
            icon={<OrderIcon fontSize="large" color="success" />}
            actions={[
              { label: 'View Recent Orders', path: '/admin/orders' },
              { label: 'Manage Order Statuses', path: '/admin/orders' }
            ]}
          />
        </Grid>

        {/* Users Management Card (Optional) */}
        {/* <Grid item xs={12} md={6} lg={4}>
          <ManagementCard
            title="Users"
            icon={<UserIcon fontSize="large" color="warning" />}
            actions={[
              { label: 'Manage Users', path: '/admin/users' },
              { label: 'Add New User', path: '/admin/users/new' }
            ]}
          />
        </Grid> */}
      </Grid>
    </Container>
  );
};

export default AdminDashboard;