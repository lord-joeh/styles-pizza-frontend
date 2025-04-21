import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrder } from '../../services/orderService';
import {
  Typography,
  Paper,
  List,
  ListItem,
  Alert,
  Box,
  Divider,
  Chip,
  Button,
  Grid,
  useMediaQuery,
  useTheme,
  Avatar,
  Skeleton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  LocalPizza,
  LocationOn,
  Receipt,
  ArrowBack,
  CheckCircle,
  Cancel,
  Schedule,
  Paid,
} from '@mui/icons-material';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  margin: theme.spacing(4, 'auto'),
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  backgroundColor: theme.palette.background.paper,
  maxWidth: 1000,
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  textAlign: 'center',
  color: theme.palette.primary.main,
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2),
}));

const StyledList = styled(List)(({ theme }) => ({
  margin: theme.spacing(3, 0),
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(2, 0),
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:last-child': {
    borderBottom: 'none',
  },
}));

const StatusIcon = ({ status }) => {
  const iconProps = { fontSize: 'small', sx: { mr: 1 } };
  switch (status) {
    case 'delivered':
      return <CheckCircle color="success" {...iconProps} />;
    case 'cancelled':
      return <Cancel color="error" {...iconProps} />;
    case 'processing':
      return <Schedule color="warning" {...iconProps} />;
    default:
      return <Schedule color="info" {...iconProps} />;
  }
};

const OrderDetails = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState({
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const fetchOrder = async () => {
      try {
        const response = await getOrder(id, { signal: abortController.signal });
        if (!isMounted) return;

        setOrder(response.data);
      } catch (err) {
        if (!isMounted) return;
        if (err.name === 'AbortError') return;

        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          'Failed to load order details. Please try again later.';
        setStatus((prev) => ({ ...prev, error: errorMessage }));
        console.error('Error fetching order:', err);
      } finally {
        if (isMounted) {
          setStatus((prev) => ({ ...prev, loading: false }));
        }
      }
    };

    fetchOrder();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [id]);

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'processing':
        return 'warning';
      default:
        return 'info';
    }
  };

  if (status.loading) {
    return (
      <StyledPaper>
        <StyledTitle variant="h4" component="h1">
          <Receipt fontSize="large" />
          Order Details
        </StyledTitle>
        <Box sx={{ py: 4 }}>
          <Skeleton variant="rectangular" height={56} sx={{ mb: 3 }} />
          <Skeleton variant="rectangular" height={200} sx={{ mb: 3 }} />
          <Skeleton variant="rectangular" height={200} />
        </Box>
      </StyledPaper>
    );
  }

  if (status.error) {
    return (
      <Box sx={{ maxWidth: 800, margin: '40px auto', textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {status.error}
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate(-1)}
          startIcon={<ArrowBack />}
        >
          Back to Orders
        </Button>
      </Box>
    );
  }

  if (!order) {
    return (
      <Box sx={{ maxWidth: 800, margin: '40px auto', textAlign: 'center' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Order not found
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate(-1)}
          startIcon={<ArrowBack />}
        >
          Back to Orders
        </Button>
      </Box>
    );
  }

  return (
    <StyledPaper>
      <Box sx={{ mb: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back to Orders
        </Button>
      </Box>

      <StyledTitle variant="h4" component="h1">
        <Receipt fontSize="large" />
        Order #{order.id}
      </StyledTitle>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Chip
            label={`Status: ${order.status}`}
            color={getStatusColor(order.status)}
            icon={<StatusIcon status={order.status} />}
            sx={{
              textTransform: 'capitalize',
              fontSize: '1rem',
              p: 2,
            }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          sx={{ textAlign: isMobile ? 'left' : 'right' }}
        >
          <Typography variant="body1" color="text.secondary">
            <strong>Order Date:</strong> {formatDate(order.created_at)}
          </Typography>
          {order.delivered_at && (
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              <strong>Delivered:</strong> {formatDate(order.delivered_at)}
            </Typography>
          )}
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <LocationOn color="primary" />
          Delivery Information
        </Typography>
        <Box
          sx={{
            backgroundColor: theme.palette.action.hover,
            borderRadius: '8px',
            p: 3,
          }}
        >
          <Typography variant="body1" paragraph>
            <strong>Address:</strong> {order.delivery_address}
          </Typography>
          {order.special_instructions && (
            <Typography variant="body1">
              <strong>Special Instructions:</strong>{' '}
              {order.special_instructions}
            </Typography>
          )}
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography
        variant="h6"
        sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
      >
        <LocalPizza color="primary" />
        Order Items ({order.items.length})
      </Typography>
      <StyledList>
        {order.items.map((item) => (
          <StyledListItem key={`${item.id}-${item.size}`}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                src={item.pizza_image}
                alt={item.pizza_name}
                sx={{ width: 56, height: 56 }}
              >
                <LocalPizza />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {item.pizza_name || `Pizza ${item.pizza_id}`}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.size} • Qty: {item.quantity}
                </Typography>
              </Box>
            </Box>
            <Typography variant="subtitle1" fontWeight="bold">
              GHS {(item.price * item.quantity).toFixed(2)}
            </Typography>
          </StyledListItem>
        ))}
      </StyledList>

      <Divider sx={{ my: 3 }} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          {order.payment_method && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 2,
              }}
            >
              <Paid color="primary" />
              <Typography variant="body1">
                <strong>Payment Method:</strong> {order.payment_method}
              </Typography>
            </Box>
          )}
          {order.payment_status && (
            <Chip
              label={`Payment: ${order.payment_status}`}
              color={
                order.payment_status === 'paid'
                  ? 'success'
                  : order.payment_status === 'failed'
                  ? 'error'
                  : 'warning'
              }
              size="small"
            />
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: theme.palette.primary.light,
              borderRadius: '8px',
              p: 2,
            }}
          >
            {/* <Typography variant="h6">Order Total: </Typography> */}
            <Typography
              variant="h5"
              sx={{ fontWeight: 'bold', color: 'primary.contrastText' }}
            >
              GHS {order.total_amount}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </StyledPaper>
  );
};

export default OrderDetails;
