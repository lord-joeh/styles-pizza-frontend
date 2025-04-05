import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  IconButton,
  Box,
  Typography,
  Container,
  CircularProgress,
  Button,
  useMediaQuery,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { styled, useTheme } from '@mui/material/styles';
import {
  getIngredients,
  createIngredient,
  updateIngredient,
  deleteIngredient,
} from '../../services/ingredientService';
import AddIngredientForm from './AddIngredientForm';
import ConfirmationDialog from '../common/ConfirmationDialog';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    fontSize: theme.typography.body1.fontSize,
  },
  '&.MuiTableCell-head': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: 'bold',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
  '&:last-child td, &:last-child th': {
    borderBottom: 0,
  },
}));

const IngredientManagement = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const editingIngredient = useMemo(
    () => (selectedIngredient ? { ...selectedIngredient } : null),
    [selectedIngredient],
  );

  const fetchIngredients = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getIngredients();
      setIngredients(data || []);
    } catch (error) {
      handleError('Failed to load ingredients', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIngredients();
  }, [fetchIngredients]);

  const handleError = useCallback((defaultMessage, error) => {
    console.error(error);
    const message =
      error.response?.data?.error || defaultMessage;
    setSnackbar({ open: true, message, severity: 'error' });
  }, []);

  const handleSuccess = useCallback((message) => {
    setSnackbar({ open: true, message, severity: 'success' });
  }, []);

  const handleCreateIngredient = useCallback(
    async (ingredientData) => {
      try {
        setOperationLoading(true);
        const { data } = await createIngredient(ingredientData);
        setIngredients((prev) => [...prev, data]);
        handleSuccess('Ingredient created successfully');
        setShowAddForm(false);
      } catch (error) {
        handleError('Failed to create ingredient', error);
      } finally {
        setOperationLoading(false);
      }
    },
    [handleError, handleSuccess],
  );

  const handleUpdateIngredient = useCallback(async () => {
    if (!editingIngredient) return;

    try {
      setOperationLoading(true);
      const { data } = await updateIngredient(
        editingIngredient.id,
        editingIngredient,
      );
      setIngredients((prev) =>
        prev.map((ing) => (ing.id === data.id ? data : ing)),
      );
      handleSuccess('Ingredient updated successfully');
      setIsEditModalOpen(false);
    } catch (error) {
      handleError('Failed to update ingredient', error);
    } finally {
      setOperationLoading(false);
    }
  }, [editingIngredient, handleError, handleSuccess]);

  const handleDeleteIngredient = useCallback(async () => {
    if (!selectedIngredient) return;

    try {
      setOperationLoading(true);
      await deleteIngredient(selectedIngredient.id);
      setIngredients((prev) =>
        prev.filter((ing) => ing.id !== selectedIngredient.id),
      );
      handleSuccess('Ingredient deleted successfully');
      setIsDeleteDialogOpen(false);
    } catch (error) {
      handleError('Failed to delete ingredient', error);
    } finally {
      setOperationLoading(false);
    }
  }, [selectedIngredient, handleError, handleSuccess]);

  const handleEditChange = useCallback((field, value) => {
    setSelectedIngredient((prev) => ({ ...prev, [field]: value }));
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="center"
        sx={{
          fontWeight: 'bold',
          color: 'primary.main',
          mb: 4,
        }}
      >
        Ingredient Management
      </Typography>

      {showAddForm ? (
        <AddIngredientForm
          onSubmit={handleCreateIngredient}
          onCancel={() => setShowAddForm(false)}
          loading={operationLoading}
        />
      ) : (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowAddForm(true)}
            sx={{ mb: 4 }}
            startIcon={operationLoading && <CircularProgress size={20} />}
            disabled={operationLoading}
          >
            Add New Ingredient
          </Button>

          <TableContainer component={Paper} elevation={3} sx={{ mb: 4 }}>
            <Table size={isMobile ? 'small' : 'medium'}>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell>Description</StyledTableCell>
                  <StyledTableCell align="right">Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ingredients.map((ingredient) => (
                  <StyledTableRow key={ingredient.id} hover>
                    <StyledTableCell>{ingredient.name}</StyledTableCell>
                    <StyledTableCell>
                      {ingredient.description || '-'}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <Box display="flex" justifyContent="flex-end" gap={1}>
                        <IconButton
                          onClick={() => {
                            setSelectedIngredient(ingredient);
                            setIsEditModalOpen(true);
                          }}
                          color="primary"
                          disabled={operationLoading}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            setSelectedIngredient(ingredient);
                            setIsDeleteDialogOpen(true);
                          }}
                          color="error"
                          disabled={operationLoading}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Edit Dialog */}
      <Dialog
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
          Edit Ingredient
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            label="Name"
            value={editingIngredient?.name || ''}
            onChange={(e) => handleEditChange('name', e.target.value)}
            fullWidth
            margin="normal"
            required
            disabled={operationLoading}
            error={!editingIngredient?.name}
            helperText={!editingIngredient?.name && 'Name is required'}
          />
          <TextField
            label="Description"
            value={editingIngredient?.description || ''}
            onChange={(e) => handleEditChange('description', e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={3}
            disabled={operationLoading}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsEditModalOpen(false)}
            disabled={operationLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateIngredient}
            variant="contained"
            color="primary"
            disabled={operationLoading || !editingIngredient?.name}
          >
            {operationLoading ? <CircularProgress size={24} /> : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteIngredient}
        title="Delete Ingredient"
        content={`Are you sure you want to delete "${selectedIngredient?.name}"?`}
        loading={operationLoading}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default IngredientManagement;
