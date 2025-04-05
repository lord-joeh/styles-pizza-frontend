import api from '../utils/api';

export const createOrder = async (orderData) => {
  try {
    if (!orderData?.items || orderData.items.length === 0) {
      throw new Error('Order must contain at least one item');
    }
    const response = await api.post('/orders', orderData);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.error ||
      error.message ||
      'Failed to create order. Please try again.';
    throw new Error(message);
  }
};

export const getOrders = async (params = {}) => {
  try {
    const response = await api.get('/orders', { params });
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.error ||
      error.message ||
      'Failed to fetch orders. Please try again.';
    throw new Error(message);
  }
};

export const getOrder = async (orderId) => {
  try {
    if (!orderId) throw new Error('Order ID is required');
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.error ||
      error.message ||
      'Failed to fetch order. Please try again.';
    throw new Error(message);
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    if (!orderId || !status) {
      throw new Error('Order ID and status are required');
    }
    const response = await api.put(`/orders/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.error ||
      error.message ||
      'Failed to update order status. Please try again.';
    throw new Error(message);
  }
};

export const updatePaymentStatus = async (orderId, paymentStatus) => {
  try {
    if (!orderId || !paymentStatus) {
      throw new Error('Order ID and payment status are required');
    }
    const response = await api.put(`/orders/${orderId}/payment-status`, {
      payment_status: paymentStatus,
    });
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.error ||
      error.message ||
      'Failed to update payment status. Please try again.';
    throw new Error(message);
  }
};

export const updateDeliveryStatus = async (orderId, deliveryStatus) => {
  try {
    if (!orderId || !deliveryStatus) {
      throw new Error('Order ID and delivery status are required');
    }
    const response = await api.put(`/orders/${orderId}/delivery-status`, {
      delivery_status: deliveryStatus,
    });
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.error ||
      error.message ||
      'Failed to update delivery status. Please try again.';
    throw new Error(message);
  }
};

export const deleteOrder = async (orderId) => {
  try {
    if (!orderId) throw new Error('Order ID is required');
    const response = await api.delete(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.error ||
      error.message ||
      'Failed to delete order. Please try again.';
    throw new Error(message);
  }
};

export const getOrdersByCustomer = async (customerId) => {
  try {
    // Get user from localStorage
    const user = JSON.parse(localStorage.getItem('user'));

    // Validate we have required data
    if (!customerId) {
      throw new Error('Customer ID is required');
    }
    if (!user?.token) {
      throw new Error('Authentication token not found. Please login again.');
    }

    // Make API request with authorization header
    const response = await api.get(`/orders/customer/${customerId}`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
        'Content-Type': 'application/json',
      },
    });

    // Validate response
    if (!response.data) {
      throw new Error('No data received from server');
    }

    return response.data;
  } catch (error) {
    console.error('Order Service Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.error,
    });

    // Handle specific error cases
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear invalid user data
      localStorage.removeItem('user');
      throw new Error('Your session has expired. Please login again.');
    }

    throw new Error(
      error.response?.data?.error ||
        error.message ||
        'Failed to fetch orders. Please try again later.',
    );
  }
};

export const cancelOrder = async (orderId) => {
  try {
    if (!orderId) throw new Error('Order ID is required');
    const response = await api.put(`/orders/${orderId}/cancel`);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.error ||
      error.message ||
      'Failed to cancel order. Please try again.';
    throw new Error(message);
  }
};
