import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getOrdersByCustomer } from '../../services/orderService';
import {
  Typography,
  Paper,
  List,
  ListItem,
  CircularProgress,
  Alert,
  Box,
  Chip,
  Divider,
  Grid,
  Button,
  Skeleton,
  useMediaQuery,
  useTheme,
  Badge,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  History,
  ShoppingBag,
  CheckCircle,
  Cancel,
  Schedule,
  Login,
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
  padding: 0,
  transition: 'all 0.2s ease',
  '& a': {
    width: '100%',
    padding: theme.spacing(3),
    textDecoration: 'none',
    color: 'inherit',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      transform: 'translateY(-2px)',
    },
  },
}));

const StatusIcon = ({ status }) => {
  const iconProps = { fontSize: 'small', sx: { mr: 1 } };
  switch (status?.toLowerCase()) {
    case 'delivered':
      return <CheckCircle color="success" {...iconProps} />;
    case 'cancelled':
    case 'canceled':
      return <Cancel color="error" {...iconProps} />;
    case 'processing':
      return <Schedule color="warning" {...iconProps} />;
    default:
      return <ShoppingBag color="primary" {...iconProps} />;
  }
};

const OrderHistory = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState({
    loading: true,
    error: null,
    success: null,
  });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchOrders = async () => {
      try {
        if (isMounted) {
          setStatus(prev => ({ ...prev, loading: true, error: null }));
        }

        const user = JSON.parse(localStorage.getItem('user'));
        if (!user?.id) {
          throw new Error('Please login to view your orders');
        }

        const ordersData = await getOrdersByCustomer(user.id, {
          signal: controller.signal
        });

        if (!isMounted) return;

        const ordersArray = Array.isArray(ordersData)
          ? ordersData
          : ordersData?.data || [];

        setOrders(
          ordersArray.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at),
        ));

        if (location.state?.orderSuccess) {
          setStatus(prev => ({
            ...prev,
            success: 'Order placed successfully! Your order will be ready in the next 30 minutes'
          }));
          window.history.replaceState({}, '');
        }
      } catch (err) {
        if (isMounted) {
          console.error('Fetch error:', err);
          handleFetchError(err);
        }
      } finally {
        if (isMounted) {
          setStatus(prev => ({ ...prev, loading: false }));
          setRefreshing(false);
        }
      }
    };

    fetchOrders();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [location.state, refreshing]);

  const handleFetchError = (err) => {
    const errorMap = {
      'Authorization failed': 'Your session has expired. Please login again.',
      'Unauthorized': 'Please login to view your orders',
      'Network Error': 'Unable to connect to the server. Please check your internet connection.',
      default: 'Failed to load order history. Please try again later.'
    };

    const errorMessage = Object.entries(errorMap).find(([key]) => 
      err.message.includes(key) || err.response?.status === 403
    )?.[1] || errorMap.default;

    setStatus(prev => ({
      ...prev,
      error: errorMessage
    }));
  };

  const handleRefresh = () => {
    setRefreshing(true);
  };

  const handleLoginRedirect = () => {
    navigate('/login', { state: { from: location.pathname } });
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'N/A';
      const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch {
      return 'Invalid date';
    }
  };

  const getStatusColor = (status) => {
    if (!status) return 'default';
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'success';
      case 'cancelled':
      case 'canceled':
        return 'error';
      case 'processing':
        return 'warning';
      default:
        return 'primary';
    }
  };

  const renderSkeletons = () => (
    <Box sx={{ py: 4 }}>
      {[...Array(3)].map((_, index) => (
        <React.Fragment key={index}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 3 }}>
            <Box>
              <Skeleton width={Math.random() * 50 + 100} height={30} />
              <Skeleton width={Math.random() * 80 + 120} height={24} sx={{ mt: 1 }} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Skeleton width={80} height={32} />
              <Skeleton width={60} height={30} />
            </Box>
          </Box>
          <Divider />
        </React.Fragment>
      ))}
    </Box>
  );

  if (status.loading && !refreshing) {
    return <StyledPaper>{renderSkeletons()}</StyledPaper>;
  }

  if (status.error?.includes('login')) {
    return (
      <Box sx={{ maxWidth: 800, margin: '40px auto', textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {status.error}
        </Alert>
        <Button
          variant="contained"
          onClick={handleLoginRedirect}
          startIcon={<Login />}
          sx={{ mt: 2 }}
        >
          Login Now
        </Button>
      </Box>
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
          onClick={handleRefresh}
          startIcon={refreshing && <CircularProgress size={20} color="inherit" />}
          disabled={refreshing}
        >
          {refreshing ? 'Refreshing...' : 'Retry'}
        </Button>
      </Box>
    );
  }

  return (
    <StyledPaper>
      <StyledTitle variant="h4" component="h1">
        <History fontSize="large" />
        Order History
      </StyledTitle>

      {status.success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {status.success}
        </Alert>
      )}

      {orders.length === 0 && !status.loading ? (
        <Box textAlign="center" py={4}>
          <Typography variant="body1" gutterBottom>
            You haven't placed any orders yet.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/customer/pizzas"
            sx={{ mt: 2 }}
          >
            Browse Menu
          </Button>
        </Box>
      ) : (
        <>
          <Box textAlign="right" mb={2}>
            <Button
              variant="outlined"
              onClick={handleRefresh}
              disabled={refreshing}
              startIcon={refreshing && <CircularProgress size={20} />}
            >
              {refreshing ? 'Refreshing...' : 'Refresh Orders'}
            </Button>
          </Box>

          <StyledList>
            {orders.map((order) => (
              <React.Fragment key={order.id}>
                <StyledListItem>
                  <Link to={`/customer/orders/${order.id}`} aria-label={`View order details for order ${order.id}`}>
                    <Grid container alignItems="center">
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: isMobile ? 1 : 0 }}>
                          <Badge
                            badgeContent={order.items?.length || 0}
                            color="primary"
                            sx={{ mr: 2 }}
                            aria-label={`${order.items?.length || 0} items in order`}
                          >
                            <ShoppingBag color="action" />
                          </Badge>
                          <Box>
                            <Typography variant="subtitle1" fontWeight="bold">
                              Order #{order.id}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(order.created_at)}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: isMobile ? 'flex-start' : 'flex-end',
                          mt: isMobile ? 2 : 0,
                          gap: 2
                        }}>
                          <Chip
                            label={order.status || 'Unknown'}
                            color={getStatusColor(order.status)}
                            size="small"
                            icon={<StatusIcon status={order.status} />}
                            sx={{ textTransform: 'capitalize' }}
                            aria-label={`Order status: ${order.status}`}
                          />
                          <Typography variant="subtitle1" fontWeight="bold">
                            GHS {order.total_amount?.toFixed(2) || '0.00'}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Link>
                </StyledListItem>
                <Divider />
              </React.Fragment>
            ))}
          </StyledList>
        </>
      )}
    </StyledPaper>
  );
};

export default OrderHistory;