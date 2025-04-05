import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { createOrder } from '../../services/orderService';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  Input,
  Box,
  CircularProgress,
  Alert,
  Divider,
  TextField,
  Grid,
  IconButton,
  Snackbar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  RemoveShoppingCart,
  Add,
  Remove,
  ShoppingCartCheckout,
  ArrowBack,
} from '@mui/icons-material';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(4, 'auto'),
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  backgroundColor: theme.palette.background.paper,
  maxWidth: 800,
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  textAlign: 'center',
  color: theme.palette.primary.main,
  fontWeight: 'bold',
}));

const StyledList = styled(List)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2, 0),
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:last-child': {
    borderBottom: 'none',
  },
}));

const QuantityControl = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const StyledInput = styled(Input)(({ theme }) => ({
  width: 50,
  '& input': {
    textAlign: 'center',
    padding: theme.spacing(1),
    fontSize: '0.875rem',
  },
}));

const StyledRemoveButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.error.main,
  '&:hover': {
    backgroundColor: theme.palette.error.light + '33', // Add transparency
  },
}));

const StyledTotal = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1.5rem',
  textAlign: 'right',
  margin: theme.spacing(3, 0),
  color: theme.palette.primary.main,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5),
  fontWeight: 'bold',
  fontSize: '1rem',
}));

const Cart = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    cartItems,
    clearCart,
    total,
    removeFromCart,
    updateQuantity,
    cartCount,
  } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    deliveryAddress: '',
    specialInstructions: '',
  });
  const [status, setStatus] = useState({
    loading: false,
    error: null,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleCreateOrder = async () => {
    if (!formData.deliveryAddress.trim()) {
      setStatus({ loading: false, error: 'Delivery address is required' });
      return;
    }

    setStatus({ loading: true, error: null });

    try {
      const orderData = {
        items: cartItems.map((item) => ({
          pizza_id: item.id,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
        })),
        delivery_address: formData.deliveryAddress,
        special_instructions: formData.specialInstructions,
      };

      await createOrder(orderData);
      clearCart();
      showSnackbar('Order placed successfully!', 'success');
      navigate('/customer/orders', { state: { orderSuccess: true } });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Failed to create order. Please try again.';
      setStatus({ loading: false, error: errorMessage });
      showSnackbar(errorMessage, 'error');
    }
  };

  const handleQuantityChange = (pizzaId, newQuantity) => {
    const parsedQuantity = parseInt(newQuantity, 10);
    if (!isNaN(parsedQuantity) && parsedQuantity > 0) {
      updateQuantity(pizzaId, parsedQuantity);
    }
  };

  const incrementQuantity = (pizzaId, currentQuantity) => {
    updateQuantity(pizzaId, currentQuantity + 1);
  };

  const decrementQuantity = (pizzaId, currentQuantity) => {
    if (currentQuantity > 1) {
      updateQuantity(pizzaId, currentQuantity - 1);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <>
      <StyledPaper>
        <StyledTitle variant="h4" component="h1">
          Your Shopping Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
        </StyledTitle>

        {cartItems.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography variant="body1" gutterBottom>
              Your cart is empty
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ArrowBack />}
              onClick={() => navigate('/customer/pizzas')}
              sx={{ mt: 2 }}
            >
              Browse Pizzas
            </Button>
          </Box>
        ) : (
          <>
            <StyledList>
              {cartItems.map((item) => (
                <React.Fragment key={`${item.id}-${item.size}`}>
                  <StyledListItem>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 'bold' }}
                      >
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.size} • GHS {item.price}
                      </Typography>
                    </Box>
                    <QuantityControl>
                      <IconButton
                        size="small"
                        onClick={() => decrementQuantity(item.id, item.quantity)}
                        aria-label={`Decrease ${item.name} quantity`}
                        disabled={item.quantity <= 1}
                      >
                        <Remove fontSize="small" />
                      </IconButton>
                      <StyledInput
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(item.id, e.target.value)
                        }
                        inputProps={{
                          'aria-label': `${item.name} quantity`,
                          style: { MozAppearance: 'textfield' },
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => incrementQuantity(item.id, item.quantity)}
                        aria-label={`Increase ${item.name} quantity`}
                      >
                        <Add fontSize="small" />
                      </IconButton>
                      <StyledRemoveButton
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <RemoveShoppingCart fontSize="small" />
                      </StyledRemoveButton>
                    </QuantityControl>
                  </StyledListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </StyledList>

            <StyledTotal>
              Total: GHS {total.toFixed(2)}
            </StyledTotal>

            <StyledTextField
              label="Delivery Address"
              name="deliveryAddress"
              value={formData.deliveryAddress}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              required
              autoComplete="shipping street-address"
            />

            <StyledTextField
              label="Special Instructions (Optional)"
              name="specialInstructions"
              value={formData.specialInstructions}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              placeholder="Any specific delivery instructions or notes about your order..."
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <StyledButton
                  variant="outlined"
                  color="primary"
                  fullWidth
                  onClick={() => navigate('/customer/pizzas')}
                  startIcon={<ArrowBack />}
                >
                  Continue Shopping
                </StyledButton>
              </Grid>
              <Grid item xs={6}>
                <StyledButton
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleCreateOrder}
                  disabled={status.loading}
                  aria-busy={status.loading}
                  startIcon={
                    status.loading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <ShoppingCartCheckout />
                    )
                  }
                >
                  {status.loading ? 'Processing...' : 'Place Order'}
                </StyledButton>
              </Grid>
            </Grid>

            {status.error && (
              <Alert
                severity="error"
                sx={{ mt: 2 }}
                onClose={() => setStatus((prev) => ({ ...prev, error: null }))}
              >
                {status.error}
              </Alert>
            )}
          </>
        )}
      </StyledPaper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Cart;