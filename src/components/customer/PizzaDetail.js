import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPizzaById } from '../../services/pizzaService';
import { CartContext } from '../../context/CartContext';
import {
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Box,
  Chip,
  Divider,
  Grid,
  Rating,
  IconButton,
  Tooltip,
  Snackbar,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  LocalPizza,
  ShoppingCart,
  ArrowBack,
  Favorite,
  FavoriteBorder,
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

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: '100%',
  margin: '0 auto',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: 'none',
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '100%',
  minHeight: 350,
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  height: '100%',
  minHeight: 350,
  objectFit: 'cover',
}));

const FavoriteButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: 16,
  right: 16,
  zIndex: 1,
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    backgroundColor: theme.palette.background.paper,
  },
}));

const PizzaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pizza, setPizza] = useState(null);
  const [status, setStatus] = useState({
    loading: true,
    error: null,
  });
  const [favorite, setFavorite] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const fetchPizza = async () => {
      try {
        setStatus((prev) => ({ ...prev, loading: true }));
        const response = await getPizzaById(id, { signal: abortController.signal });
        if (!isMounted) return;

        setPizza(response.data);
        
        const favorites = JSON.parse(localStorage.getItem('favoritePizzas')) || [];
        setFavorite(favorites.includes(response.data?.id));
      } catch (err) {
        if (!isMounted) return;
        if (err.name === 'AbortError') return;

        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          'Failed to load pizza details. Please try again later.';
        setStatus((prev) => ({ ...prev, error: errorMessage }));
        showSnackbar(errorMessage, 'error');
        console.error('Error fetching pizza:', err);
      } finally {
        if (isMounted) {
          setStatus((prev) => ({ ...prev, loading: false }));
        }
      }
    };

    fetchPizza();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [id]);

  const toggleFavorite = () => {
    if (!pizza) return;
    
    try {
      setFavorite((prev) => {
        const newFavorite = !prev;
        const favorites = JSON.parse(localStorage.getItem('favoritePizzas')) || [];
        
        if (newFavorite) {
          localStorage.setItem('favoritePizzas', JSON.stringify([...favorites, pizza.id]));
        } else {
          localStorage.setItem(
            'favoritePizzas',
            JSON.stringify(favorites.filter((id) => id !== pizza.id))
          );
        }
        
        showSnackbar(
          newFavorite ? 'Added to favorites!' : 'Removed from favorites!',
          'success'
        );
        return newFavorite;
      });
    } catch (err) {
      console.error('Error updating favorites:', err);
      showSnackbar('Failed to update favorites. Please try again.', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleAddToCart = () => {
    if (!pizza) return;
    
    addToCart(pizza);
    showSnackbar(`${pizza.name} added to cart!`, 'success');
  };

  if (status.loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '300px',
        }}
      >
        <CircularProgress size={60} />
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
          onClick={() => navigate(-1)}
          startIcon={<ArrowBack />}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  if (!pizza) {
    return (
      <Box sx={{ maxWidth: 800, margin: '40px auto', textAlign: 'center' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Pizza not found
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate(-1)}
          startIcon={<ArrowBack />}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', px: 2 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3, pt: 2 }}>
        <MuiLink
          color="inherit"
          href="/customer/pizzas"
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <LocalPizza sx={{ mr: 0.5 }} fontSize="inherit" />
          Pizzas
        </MuiLink>
        <Typography color="text.primary">{pizza.name}</Typography>
      </Breadcrumbs>

      <StyledPaper>
        <StyledCard>
          <Grid container>
            <Grid item xs={12} md={6}>
              <ImageContainer>
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
                  aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
                  onClick={toggleFavorite}
                >
                  {favorite ? (
                    <Favorite color="error" />
                  ) : (
                    <FavoriteBorder />
                  )}
                </FavoriteButton>
              </ImageContainer>
            </Grid>
            <Grid item xs={12} md={6}>
              <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    sx={{
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <LocalPizza color="primary" />
                    {pizza.name}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Chip
                      label={pizza.size}
                      color="primary"
                      size="medium"
                      sx={{ fontWeight: 'bold' }}
                    />
                    <Rating
                      value={pizza.rating || 4.5}
                      precision={0.5}
                      readOnly
                    />
                  </Box>

                  <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                    {pizza.description}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  {pizza.ingredients && pizza.ingredients.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Ingredients:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {pizza.ingredients.map((ingredient) => (
                          <Tooltip key={ingredient.id} title={ingredient.description || ''} arrow>
                            <Chip
                              label={ingredient.name}
                              variant="outlined"
                              size="medium"
                              sx={{ fontWeight: '500' }}
                            />
                          </Tooltip>
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>

                <Box>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 'bold',
                      color: 'primary.main',
                      mb: 3,
                    }}
                  >
                    GHS {pizza.price}
                  </Typography>

                  <CardActions sx={{ p: 0, display: 'flex', gap: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<ArrowBack />}
                      onClick={() => navigate(-1)}
                      sx={{ flex: 1 }}
                    >
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<ShoppingCart />}
                      onClick={handleAddToCart}
                      sx={{
                        flex: 2,
                        fontWeight: 'bold',
                        py: 1.5,
                      }}
                      size="large"
                    >
                      Add to Cart
                    </Button>
                  </CardActions>
                </Box>
              </CardContent>
            </Grid>
          </Grid>
        </StyledCard>
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
    </Box>
  );
};

export default PizzaDetail;