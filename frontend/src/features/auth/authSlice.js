import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
import api from '../../utils/api';

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/users/', credentials, { withCredentials: true });
      return { ...data, role: 'user' };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 
        err.response?.data || 
        'Registration failed'
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/users/login', credentials, { withCredentials: true });
      return { ...data, role: 'user' };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 
        err.response?.data || 
        'Invalid email or password'
      );
    }
  }
);

export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/admin/login', credentials, { withCredentials: true });
      return { ...data, role: 'admin' };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 
        err.response?.data || 
        'Invalid admin credentials'
      );
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (role, { rejectWithValue }) => {
    try {
      const url = role === 'admin' ? '/admin/logout' : '/users/logout';
      await api.post(url, {}, { withCredentials: true });
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Logout failed');
    }
  }
);

export const updateProfileImage = createAsyncThunk(
  'auth/updateProfileImage',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post('/users/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to update profile');
    }
  }
);

export const fetchUser = createAsyncThunk('auth/fetchUser', async(_,{rejectWithValue}) => {
  try {
    const res = await api.get('/users/home',{},{withCredentials:true});
    return res.data
  } catch (error) {
    return rejectWithValue(err.response?.data || "Failed to fetch User")
  }
})

const initialState = {
  currentUser: JSON.parse(localStorage.getItem("currentUser")) || null,
  token: localStorage.getItem("token") || null,
  role: localStorage.getItem("role") || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = null;
        state.token = null;
        state.role = 'user';
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login User
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;           // ← Important: clear old error
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.token = action.payload.token;
        state.role = 'user';
        state.error = null;

        localStorage.setItem("currentUser", JSON.stringify(action.payload));
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("role", "user");
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;   // ← Backend error comes here
      })

      // Login Admin
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.token = action.payload.token;
        state.role = 'admin';
        state.error = null;

        localStorage.setItem("currentUser", JSON.stringify(action.payload));
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("role", "admin");
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.currentUser = null;
        state.token = null;
        state.role = null;
        state.error = null;
        localStorage.removeItem("currentUser");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Profile Image
      .addCase(updateProfileImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfileImage.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.error = null;
        localStorage.setItem("currentUser",JSON.stringify(action.payload));
      })
      .addCase(updateProfileImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state,action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;

// export const checkLoggedIn = createAsyncThunk(
//   'auth/checkLoggedIn',
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await axios.post('/api/users/check', {}, { withCredentials: true });
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || 'Session check failed');
//     }
//   }
// );

// Check Logged In
      // .addCase(checkLoggedIn.pending, (state) => {
      //   state.loading = true;
      // })
      // .addCase(checkLoggedIn.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.currentUser = action.payload;
      //   state.error = null;
      // })
      // .addCase(checkLoggedIn.rejected, (state) => {
      //   state.loading = false;
      //   state.error = action.payload;
      // });