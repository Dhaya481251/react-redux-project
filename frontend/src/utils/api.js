import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor - Main Fix
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const errorMsg = error.response?.data?.error || '';

      console.error("401 Error:", errorMsg);

      // 🔥 Special handling when user is deleted by admin
      if (errorMsg === "User no longer exists" || 
          errorMsg.includes("no longer exists")) {
        
        console.log("Account was deleted by admin → Logging out...");
        
        // Clear all auth data
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        
        alert("Your account has been deleted by the admin");
        
        // Redirect to login
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;