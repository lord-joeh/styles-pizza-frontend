import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import AddPizzaForm from './AddPizzaForm';
import {
  getPizzas,
  createPizza,
  updatePizza,
  deletePizza,
} from '../../services/pizzaService';

const PizzaManagement = () => {
  const [pizzas, setPizzas] = useState([]);
  const [selectedPizza, setSelectedPizza] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pizzaToDelete, setPizzaToDelete] = useState(null);

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const { data } = await getPizzas();
        setPizzas(data || []);
      } catch (error) {
        handleError('Failed to load pizzas', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPizzas();
  }, []);

  const handleError = (message, error) => {
    console.error(error);
    setSnackbar({
      open: true,
      message: error.response?.data?.error || message,
      severity: 'error',
    });
  };

  const handleSuccess = (message) => {
    setSnackbar({
      open: true,
      message,
      severity: 'success',
    });
  };

  const refreshPizzas = async () => {
    try {
      const { data } = await getPizzas();
      setPizzas(data || []);
    } catch (error) {
      handleError('Failed to refresh pizzas', error);
    }
  };

  const handleAddNew = useCallback(() => {
    setSelectedPizza({
      name: '',
      description: '',
      price: '',
      size: '',
      image: '',
      ingredients: [],
    });
    setShowAddForm(true);
  }, []);

  const handleCreate = useCallback(async (pizzaData) => {
    try {
      setOperationLoading(true);
      await createPizza({
        ...pizzaData,
        price: Number(pizzaData.price),
      });
      await refreshPizzas();
      handleSuccess('Pizza created successfully');
      setShowAddForm(false);
    } catch (error) {
      handleError('Failed to create pizza', error);
    } finally {
      setOperationLoading(false);
    }
  }, []);

  const handleUpdate = useCallback(
    async (pizzaData) => {
      try {
        setOperationLoading(true);
        await updatePizza(selectedPizza.id, {
          ...pizzaData,
          price: Number(pizzaData.price),
        });
        await refreshPizzas();
        handleSuccess('Pizza updated successfully');
        setIsEditDialogOpen(false);
      } catch (error) {
        handleError('Failed to update pizza', error);
      } finally {
        setOperationLoading(false);
      }
    },
    [selectedPizza],
  );

  const handleDeleteClick = (pizza) => {
    setPizzaToDelete(pizza);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = useCallback(async () => {
    if (!pizzaToDelete) return;

    try {
      setOperationLoading(true);
      await deletePizza(pizzaToDelete.id);
      await refreshPizzas();
      handleSuccess('Pizza deleted successfully');
    } catch (error) {
      handleError('Failed to delete pizza', error);
    } finally {
      setOperationLoading(false);
      setDeleteDialogOpen(false);
      setPizzaToDelete(null);
    }
  }, [pizzaToDelete]);

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="center"
        color="primary"
      >
        Pizza Management
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={handleAddNew}
        sx={{ mb: 4 }}
        disabled={operationLoading}
      >
        Add New Pizza
      </Button>

      {showAddForm && (
        <AddPizzaForm
          pizza={selectedPizza}
          setPizza={setSelectedPizza}
          onSubmit={handleCreate}
          onCancel={() => setShowAddForm(false)}
          loading={operationLoading}
        />
      )}

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                Name
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                Description
              </TableCell>
              <TableCell
                sx={{ color: 'white', fontWeight: 'bold' }}
                align="right"
              >
                Price
              </TableCell>
              <TableCell
                sx={{ color: 'white', fontWeight: 'bold' }}
                align="right"
              >
                Size
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                Image
              </TableCell>
              <TableCell
                sx={{ color: 'white', fontWeight: 'bold' }}
                align="right"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pizzas.map((pizza) => (
              <TableRow key={pizza.id} hover>
                <TableCell>{pizza.name}</TableCell>
                <TableCell>{pizza.description}</TableCell>
                <TableCell align="right">
                  GHS {Number(pizza.price).toFixed(2)}
                </TableCell>
                <TableCell align="right">{pizza.size}</TableCell>
                <TableCell>
                  {pizza.image && (
                    <Box
                      component="img"
                      src={pizza.image}
                      alt={pizza.name}
                      sx={{
                        width: 50,
                        height: 50,
                        objectFit: 'cover',
                        borderRadius: 1,
                      }}
                    />
                  )}
                </TableCell>
                <TableCell align="right">
                  <Box
                    sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}
                  >
                    <IconButton
                      onClick={() => {
                        setSelectedPizza(pizza);
                        setIsEditDialogOpen(true);
                      }}
                      disabled={operationLoading}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteClick(pizza)}
                      disabled={operationLoading}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
          Edit Pizza
        </DialogTitle>
        <DialogContent>
          {selectedPizza && (
            <AddPizzaForm
              pizza={selectedPizza}
              setPizza={setSelectedPizza}
              onSubmit={handleUpdate}
              onCancel={() => setIsEditDialogOpen(false)}
              loading={operationLoading}
              isEdit
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{pizzaToDelete?.name}"? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={operationLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={operationLoading}
            startIcon={operationLoading && <CircularProgress size={20} />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PizzaManagement;
