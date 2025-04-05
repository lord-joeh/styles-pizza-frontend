import React, { useState, useEffect } from 'react';
import {
  getOrders,
  updateOrderStatus,
  updatePaymentStatus,
  updateDeliveryStatus,
  deleteOrder,
} from '../../services/orderService';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Select,
  MenuItem,
  Button,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Container,
  tableCellClasses,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled Components (moved outside the component)
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#FF5722',
    color: theme.palette.common.white,
    fontWeight: 'bold',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  '& .MuiSelect-select': {
    paddingRight: '32px',
  },
  '& fieldset': {
    borderColor: '#D1D1D1',
  },
  '&:hover fieldset': {
    borderColor: '#FF5722',
  },
  '&.Mui-focused fieldset': {
    borderColor: '#FF5722',
    boxShadow: '0 0 0 2px rgba(255, 87, 34, 0.2)',
  },
  marginRight: theme.spacing(2),
  marginBottom: theme.spacing(2),
  minWidth: 120, // Added minimum width for better UI
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#FF5722',
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: '#E64A19',
  },
  margin: theme.spacing(1),
}));

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Added total pages state
  const [limit] = useState(10);
  const [statusFilter, setStatusFilter] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = { page, limit, status: statusFilter };
        const response = await getOrders(params);
        setOrders(response.data || []);
        setTotalPages(response.totalPages || 1); // Assuming API returns totalPages
      } catch (err) {
        setError('Failed to fetch orders. Please try again later.');
        setSnackbarMessage('Failed to fetch orders');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [page, statusFilter]);

  const handleStatusUpdate = async (orderId, field, value) => {
    try {
      let updateFn;
      switch (field) {
        case 'status':
          updateFn = updateOrderStatus;
          break;
        case 'payment_status':
          updateFn = updatePaymentStatus;
          break;
        case 'delivery_status':
          updateFn = updateDeliveryStatus;
          break;
        default:
          throw new Error('Invalid field');
      }

      await updateFn(orderId, value);
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, [field]: value } : order,
        ),
      );
      setSnackbarMessage(`${field.replace('_', ' ')} updated successfully`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage(`Failed to update ${field.replace('_', ' ')}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleDelete = async (orderId) => {
    try {
      await deleteOrder(orderId);
      setOrders(orders.filter((order) => order.id !== orderId));
      setSnackbarMessage('Order deleted successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage('Failed to delete order');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px',
        }}
      >
        <CircularProgress color="primary" size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center">
        {error}
      </Typography>
    );
  }

  return (
    <Container sx={{ paddingTop: 4, paddingBottom: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="center"
        sx={{ fontWeight: 'bold', color: '#FF5722' }}
      >
        Order Management
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          flexWrap: 'wrap',
          marginBottom: 4,
        }}
      >
        <StyledSelect
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1); // Reset to first page when filter changes
          }}
          variant="outlined"
        >
          <MenuItem value="">All Orders</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="processing">Processing</MenuItem>
          <MenuItem value="shipped">Shipped</MenuItem>
          <MenuItem value="delivered">Delivered</MenuItem>
          <MenuItem value="cancelled">Cancelled</MenuItem>
        </StyledSelect>
      </Box>

      <TableContainer
        component={Paper}
        sx={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="order management table">
          <TableHead>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>Customer</StyledTableCell>
              <StyledTableCell align="right">Total</StyledTableCell>
              <StyledTableCell align="right">Status</StyledTableCell>
              <StyledTableCell align="right">Payment</StyledTableCell>
              <StyledTableCell align="right">Delivery</StyledTableCell>
              <StyledTableCell align="right">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <StyledTableRow key={order.id}>
                  <StyledTableCell component="th" scope="row">
                    {order.id}
                  </StyledTableCell>
                  <StyledTableCell>{order.customer_email}</StyledTableCell>
                  <StyledTableCell align="right">
                    GHS {order.total_amount}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <StyledSelect
                      value={order.status}
                      onChange={(e) =>
                        handleStatusUpdate(order.id, 'status', e.target.value)
                      }
                      variant="outlined"
                    >
                      {[
                        'pending',
                        'processing',
                        'shipped',
                        'delivered',
                        'cancelled',
                      ].map((status) => (
                        <MenuItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </MenuItem>
                      ))}
                    </StyledSelect>
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <StyledSelect
                      value={order.payment_status}
                      onChange={(e) =>
                        handleStatusUpdate(
                          order.id,
                          'payment_status',
                          e.target.value,
                        )
                      }
                      variant="outlined"
                    >
                      {['pending', 'paid', 'refunded', 'failed'].map(
                        (status) => (
                          <MenuItem key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </MenuItem>
                        ),
                      )}
                    </StyledSelect>
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <StyledSelect
                      value={order.delivery_status}
                      onChange={(e) =>
                        handleStatusUpdate(
                          order.id,
                          'delivery_status',
                          e.target.value,
                        )
                      }
                      variant="outlined"
                    >
                      {['pending', 'shipped', 'delivered', 'canceled'].map(
                        (status) => (
                          <MenuItem key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </MenuItem>
                        ),
                      )}
                    </StyledSelect>
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <StyledButton
                      onClick={() => handleDelete(order.id)}
                      variant="contained"
                      color="error"
                      size="small"
                    >
                      Delete
                    </StyledButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
        <StyledButton
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          variant="outlined"
        >
          Previous
        </StyledButton>
        <Typography sx={{ margin: 1, alignSelf: 'center' }}>
          Page {page} of {totalPages}
        </Typography>
        <StyledButton
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          variant="outlined"
        >
          Next
        </StyledButton>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default OrderManagement;
