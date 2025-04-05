import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  ButtonGroup,
  Button,
  Stack,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getPizzas } from '../../services/pizzaService';
import { getIngredients } from '../../services/ingredientService';
import { getOrders } from '../../services/orderService';

const ManagementCard = ({ title, icon, actions }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStock: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      let newStats = { totalItems: 0, lowStock: 0, pending: 0 };

      switch (title.toLowerCase()) {
        case 'pizzas':
          const pizzas = await getPizzas();
          newStats.totalItems = pizzas.data?.length || 0;
          break;

        case 'ingredients':
          const ingredients = await getIngredients();
          const lowStock =
            ingredients.data?.filter((ing) => ing.stock < ing.minStock)
              .length || 0;
          newStats.totalItems = ingredients.data?.length || 0;
          newStats.lowStock = lowStock;
          break;

        case 'orders':
          const orders = await getOrders();
          const pendingOrders =
            orders.data?.filter((order) => order.status === 'pending') || [];
          newStats.totalItems = orders.data?.length || 0;
          newStats.pending = pendingOrders.length;
          break;

        default:
          break;
      }

      setStats(newStats);
    } catch (err) {
      console.error(`Failed to fetch ${title.toLowerCase()} data:`, err);
      setError(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [title]); // Refetch when title changes

  const handleRetry = () => {
    fetchData();
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
          {icon}
          <Typography variant="h6">{title}</Typography>
        </Stack>

        {loading ? (
          <Box display="flex" justifyContent="center" p={2}>
            <CircularProgress size={24} />
          </Box>
        ) : error ? (
          <Box>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
            <Button variant="outlined" onClick={handleRetry}>
              Retry
            </Button>
          </Box>
        ) : (
          <>
            <Box mb={2}>
              <Typography variant="body2" gutterBottom>
                Total {title}: {stats.totalItems}
              </Typography>
              {stats.lowStock > 0 && (
                <Typography variant="body2" color="error" gutterBottom>
                  Low Stock Items: {stats.lowStock}
                </Typography>
              )}
              {stats.pending > 0 && (
                <Typography variant="body2" color="secondary">
                  Pending Orders: {stats.pending}
                </Typography>
              )}
            </Box>

            <ButtonGroup orientation="vertical" fullWidth variant="outlined">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  onClick={() => navigate(action.path)}
                  sx={{
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    '&:not(:last-child)': {
                      borderBottom: 'none',
                    },
                  }}
                >
                  {action.label}
                </Button>
              ))}
            </ButtonGroup>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default React.memo(ManagementCard);
