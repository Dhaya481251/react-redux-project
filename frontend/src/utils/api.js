import axios from 'axios';
import Swal from 'sweetalert2';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

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

api.interceptors.response.use(
  (response) => response,
  async(error) => {
    if (error.response?.status === 401) {
      const errorMsg = error.response?.data?.error || '';

      console.error("401 Error:", errorMsg);

      if (errorMsg === "User no longer exists" || 
          errorMsg.includes("no longer exists")) {
        
        console.log("Account was deleted by admin → Logging out...");
        
        await Swal.fire({
          icon: 'error',
          title: 'Account Deleted',
          text: 'Your account has been deleted by the admin',
          confirmButtonText: 'OK'
        })
        .then(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('currentUser');
          window.location.href = '/register';
        })
        return Promise.reject(error);
      }
      
    }
    return Promise.reject(error);
  }
);

export default api;