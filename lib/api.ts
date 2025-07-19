const API_BASE_URL = 'http://31.97.156.49:5001/api';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Helper function to make API calls
const apiCall = async (
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any,
  requireAuth: boolean = true
) => {
  try {
    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    if (requireAuth) {
      const token = getAuthToken();
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'API request failed');
    }

    return { success: true, data: responseData };
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Authentication API
export const authAPI = {
  login: async (email: string, password: string) => {
    return apiCall('/auth/login', 'POST', { email, password }, false);
  },

  register: async (userData: any) => {
    return apiCall('/auth/register', 'POST', userData, false);
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
    }
  },

  getCurrentUser: async () => {
    return apiCall('/auth/me');
  },
};

// Users API
export const usersAPI = {
  getAll: async () => {
    return apiCall('/users');
  },

  getById: async (id: string) => {
    return apiCall(`/users/${id}`);
  },

  create: async (userData: any) => {
    return apiCall('/users', 'POST', userData);
  },

  update: async (id: string, userData: any) => {
    return apiCall(`/users/${id}`, 'PUT', userData);
  },

  delete: async (id: string) => {
    return apiCall(`/users/${id}`, 'DELETE');
  },
};

// Customers API
export const customersAPI = {
  getAll: async () => {
    return apiCall('/customers');
  },

  getById: async (id: string) => {
    return apiCall(`/customers/${id}`);
  },

  create: async (customerData: any) => {
    return apiCall('/customers', 'POST', customerData);
  },

  update: async (id: string, customerData: any) => {
    return apiCall(`/customers/${id}`, 'PUT', customerData);
  },

  delete: async (id: string) => {
    return apiCall(`/customers/${id}`, 'DELETE');
  },
};

// Suppliers API
export const suppliersAPI = {
  getAll: async () => {
    return apiCall('/suppliers');
  },

  getById: async (id: string) => {
    return apiCall(`/suppliers/${id}`);
  },

  create: async (supplierData: any) => {
    return apiCall('/suppliers', 'POST', supplierData);
  },

  update: async (id: string, supplierData: any) => {
    return apiCall(`/suppliers/${id}`, 'PUT', supplierData);
  },

  delete: async (id: string) => {
    return apiCall(`/suppliers/${id}`, 'DELETE');
  },
};

// Orders API
export const ordersAPI = {
  getAll: async () => {
    return apiCall('/orders');
  },

  getById: async (id: string) => {
    return apiCall(`/orders/${id}`);
  },

  create: async (orderData: any) => {
    return apiCall('/orders', 'POST', orderData);
  },

  update: async (id: string, orderData: any) => {
    return apiCall(`/orders/${id}`, 'PUT', orderData);
  },

  delete: async (id: string) => {
    return apiCall(`/orders/${id}`, 'DELETE');
  },

  updateStatus: async (id: string, status: string) => {
    return apiCall(`/orders/${id}/status`, 'PUT', { status });
  },

  // Order-specific operations
  addPolicy: async (orderId: string, policyData: any) => {
    return apiCall(`/orders/${orderId}/policies`, 'POST', policyData);
  },

  addSial: async (orderId: string, sialData: any) => {
    return apiCall(`/orders/${orderId}/sials`, 'POST', sialData);
  },

  addCustomsDeclaration: async (orderId: string, customsData: any) => {
    return apiCall(`/orders/${orderId}/customs`, 'POST', customsData);
  },

  addPurchaseInvoice: async (orderId: string, invoiceData: any) => {
    return apiCall(`/orders/${orderId}/purchase-invoices`, 'POST', invoiceData);
  },

  addTransportLocation: async (orderId: string, locationData: any) => {
    return apiCall(`/orders/${orderId}/transport-locations`, 'POST', locationData);
  },
};

// Vehicles API
export const vehiclesAPI = {
  getAll: async () => {
    return apiCall('/vehicles');
  },

  getById: async (id: string) => {
    return apiCall(`/vehicles/${id}`);
  },

  create: async (vehicleData: any) => {
    return apiCall('/vehicles', 'POST', vehicleData);
  },

  update: async (id: string, vehicleData: any) => {
    return apiCall(`/vehicles/${id}`, 'PUT', vehicleData);
  },

  delete: async (id: string) => {
    return apiCall(`/vehicles/${id}`, 'DELETE');
  },
};

// Invoices API
export const invoicesAPI = {
  getAll: async () => {
    return apiCall('/invoices');
  },

  getById: async (id: string) => {
    return apiCall(`/invoices/${id}`);
  },

  create: async (invoiceData: any) => {
    return apiCall('/invoices', 'POST', invoiceData);
  },

  update: async (id: string, invoiceData: any) => {
    return apiCall(`/invoices/${id}`, 'PUT', invoiceData);
  },

  delete: async (id: string) => {
    return apiCall(`/invoices/${id}`, 'DELETE');
  },
};

// Reports API
export const reportsAPI = {
  getDashboardStats: async () => {
    return apiCall('/reports/dashboard');
  },

  getOrderStats: async () => {
    return apiCall('/reports/orders');
  },

  getFinancialStats: async () => {
    return apiCall('/reports/financial');
  },
};

// Shipments API
export const shipmentsAPI = {
  getAll: async () => {
    return apiCall('/shipments');
  },

  getById: async (id: string) => {
    return apiCall(`/shipments/${id}`);
  },

  create: async (shipmentData: any) => {
    return apiCall('/shipments', 'POST', shipmentData);
  },

  update: async (id: string, shipmentData: any) => {
    return apiCall(`/shipments/${id}`, 'PUT', shipmentData);
  },

  delete: async (id: string) => {
    return apiCall(`/shipments/${id}`, 'DELETE');
  },

  updateTracking: async (id: string, trackingData: any) => {
    return apiCall(`/shipments/${id}/tracking`, 'PUT', trackingData);
  },
};

// Notifications API
export const notificationsAPI = {
  getAll: async () => {
    return apiCall('/notifications');
  },

  markAsRead: async (id: string) => {
    return apiCall(`/notifications/${id}/read`, 'PUT');
  },

  markAllAsRead: async () => {
    return apiCall('/notifications/read-all', 'PUT');
  },

  delete: async (id: string) => {
    return apiCall(`/notifications/${id}`, 'DELETE');
  },
};

// Profile API
export const profileAPI = {
  getProfile: async () => {
    return apiCall('/profile');
  },

  updateProfile: async (profileData: any) => {
    return apiCall('/profile', 'PUT', profileData);
  },

  changePassword: async (passwordData: any) => {
    return apiCall('/profile/password', 'PUT', passwordData);
  },
};

// Export all APIs
export default {
  auth: authAPI,
  users: usersAPI,
  customers: customersAPI,
  suppliers: suppliersAPI,
  orders: ordersAPI,
  vehicles: vehiclesAPI,
  invoices: invoicesAPI,
  reports: reportsAPI,
  shipments: shipmentsAPI,
  notifications: notificationsAPI,
  profile: profileAPI,
}; 