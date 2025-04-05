import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getPizzas } from '../../services/pizzaService';
import { CartContext } from '../../context/CartContext';
import {
  Typography,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Alert,
  Box,
  Container,
  Chip,
  Skeleton,
  Rating,
  Tooltip,
  IconButton,
  Badge,
  Snackbar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  LocalPizza,
  ShoppingCart,
  Info,
  Favorite,
  FavoriteBorder,
} from '@mui/icons-material';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(2, 'auto'),
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  backgroundColor: theme.palette.background.paper,
  width: '1300px',
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    margin: theme.spacing(2, 'auto'),
  },
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
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.5rem',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 350,
  minWidth: 280,
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
  },
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  position: 'relative',
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
    minWidth: 'auto',
    margin: '0 auto',
  },
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  height: 200,
  [theme.breakpoints.down('sm')]: {
    height: 180,
  },
  objectFit: 'cover',
  borderTopLeftRadius: '12px',
  borderTopRightRadius: '12px',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
    background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
  },
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(3),
  },
  flexGrow: 1,
}));

const StyledCardActions = styled(CardActions)(({ theme }) => ({
  padding: theme.spacing(0, 2, 2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(0, 3, 3),
  },
  display: 'flex',
  gap: theme.spacing(1),
  justifyContent: 'space-between',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  fontWeight: 'bold',
  flex: 1,
  whiteSpace: 'nowrap',
  fontSize: '0.75rem',
  [theme.breakpoints.up('sm')]: {
    fontSize: '0.875rem',
    padding: theme.spacing(1, 2),
  },
}));

const FavoriteButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: 8,
  right: 8,
  zIndex: 1,
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    backgroundColor: theme.palette.background.paper,
  },
  [theme.breakpoints.down('sm')]: {
    padding: '6px',
    '& svg': {
      fontSize: '1.25rem',
    },
  },
}));

const PizzaList = () => {
  const [pizzas, setPizzas] = useState([]);
  const [status, setStatus] = useState({
    loading: true,
    error: null,
  });
  const [favorites, setFavorites] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const { addToCart } = useContext(CartContext);

  const fetchPizzas = async () => {
    try {
      setStatus((prev) => ({ ...prev, loading: true }));
      const response = await getPizzas();
      setPizzas(response.data || []);
      setStatus((prev) => ({ ...prev, error: null }));
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        'Failed to load pizzas. Please try again later.';
      setStatus((prev) => ({ ...prev, error: errorMessage }));
      showSnackbar(errorMessage, 'error');
    } finally {
      setStatus((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchPizzas();

    // Load favorites from localStorage
    const savedFavorites =
      JSON.parse(localStorage.getItem('favoritePizzas')) || [];
    setFavorites(savedFavorites);
  }, []);

  const toggleFavorite = (pizzaId) => {
    setFavorites((prev) => {
      const newFavorites = prev.includes(pizzaId)
        ? prev.filter((id) => id !== pizzaId)
        : [...prev, pizzaId];

      // Save to localStorage
      localStorage.setItem('favoritePizzas', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleAddToCart = (pizza) => {
    addToCart(pizza);
    showSnackbar(`${pizza.name} added to cart!`);
  };

  if (status.loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Skeleton variant="rectangular" height={220} animation="wave" />
              <Box sx={{ pt: 0.5 }}>
                <Skeleton animation="wave" />
                <Skeleton width="60%" animation="wave" />
                <Skeleton width="80%" animation="wave" />
                <Skeleton width="40%" animation="wave" />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  if (status.error) {
    return (
      <Box sx={{ maxWidth: 800, margin: '40px auto' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {status.error}
        </Alert>
        <Button
          variant="contained"
          onClick={fetchPizzas}
          startIcon={<CircularProgress size={20} color="inherit" />}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <>
      <StyledPaper>
        <StyledTitle variant="h4" component="h1">
          <LocalPizza fontSize="large" />
          Our Delicious Pizzas
        </StyledTitle>

        {pizzas.length === 0 ? (
          <Typography variant="body1" align="center" sx={{ py: 4 }}>
            No pizzas available at the moment. Please check back later!
          </Typography>
        ) : (
          <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 3 } }}>
            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
              {pizzas.map((pizza) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={pizza.id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    padding: { xs: '8px!important', sm: '16px!important' },
                  }}
                >
                  <StyledCard>
                    <StyledCardMedia
                      component="img"
                      image={pizza.image || '/placeholder-pizza.jpg'}
                      alt={pizza.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-pizza.jpg';
                      }}
                    />
                    <FavoriteButton
                      aria-label="add to favorites"
                      onClick={() => toggleFavorite(pizza.id)}
                    >
                      {favorites.includes(pizza.id) ? (
                        <Favorite color="error" />
                      ) : (
                        <FavoriteBorder />
                      )}
                    </FavoriteButton>
                    <StyledCardContent>
                      <Box display="flex" justifyContent="space-between">
                        <Typography
                          variant="h6"
                          component="h3"
                          gutterBottom
                          sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }}
                        >
                          {pizza.name}
                        </Typography>
                        {pizza.isPopular && (
                          <Tooltip title="Popular choice" arrow>
                            <Badge badgeContent="🔥" color="error" />
                          </Tooltip>
                        )}
                      </Box>
                      <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <Chip
                          label={pizza.size}
                          color="primary"
                          size="small"
                          sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}
                        />
                        <Rating
                          name="pizza-rating"
                          value={pizza.rating || 4}
                          precision={0.5}
                          readOnly
                          size="small"
                          sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}
                        />
                      </Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        paragraph
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          fontSize: { xs: '0.8rem', sm: '0.9rem' },
                        }}
                      >
                        {pizza.description}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 'bold',
                          color: 'primary.main',
                          mt: 1,
                          fontSize: { xs: '1rem', sm: '1.1rem' },
                        }}
                      >
                        GHS {pizza.price}
                      </Typography>
                    </StyledCardContent>
                    <StyledCardActions>
                      <StyledButton
                        component={Link}
                        to={`/customer/pizza/${pizza.id}`}
                        startIcon={<Info />}
                      >
                        Details
                      </StyledButton>
                      <StyledButton
                        onClick={() => handleAddToCart(pizza)}
                        startIcon={<ShoppingCart />}
                      >
                        Add to Cart
                      </StyledButton>
                    </StyledCardActions>
                  </StyledCard>
                </Grid>
              ))}
            </Grid>
          </Container>
        )}
      </StyledPaper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
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

export default PizzaList;
