import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from '../../utils/api';

export const fetchUsers = createAsyncThunk('admin/fetchUsers',async({search='',page=1,limit=5},{rejectWithValue}) => {
    try {
        let url = `/admin/users?page=${page}&limit=${limit}`;
        if(search && search.trim()!==''){
            url+=`&search=${encodeURIComponent(search.trim())}`
        }
        // const url = search ? `/admin/users?search=${encodeURIComponent(search.trim())}`:'/admin/users';
        const {data} = await api.get(url,{withCredentials:true});
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
})

export const editUser = createAsyncThunk('adminAuth/editUser',async({userId,formData},{rejectWithValue}) => {
    try { 
        const res = await api.put(`/admin/users/${userId}`,formData,{
            headers:{
                'Content-Type':'multipart/form-data'
            }
        });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message); 
    }
})

export const deleteUser = createAsyncThunk('admin/deleteUser',async(userId,{rejectWithValue}) => {
    console.log('starting deleting user',userId);
    console.log('Current token in localstorage : ',!!localStorage.getItem('token'));
    try {
        console.log('sending delete request');
        const {data} = await api.delete(`/admin/users/${userId}`);
        console.log('Delete successful : ',data);
        return data;
    } catch (err) {
        console.error("Delete failed : ",err.response?.data || err.message)
        return rejectWithValue(err.response.data);
    }
})

export const createUser = createAsyncThunk('admin/createUser',async(credentials,{rejectWithValue}) => {
    try {
        const { data } = await api.post('/admin/create',credentials,{withCredentials:true});
        return {...data,role:'user'};
    } catch (err) {
        return rejectWithValue(err.response.data.message || 'User creation in admin side failed');
    }
});

const initialState = {
    users:[],
    currentPage:1,
    totalPages:1,
    totalUsers:0,
    hasNext:false,
    hasPrev:false,
    loading:false,
    error:null,
    searchQuery:'',
    role:localStorage.getItem("role") || null
}
const adminSlice = createSlice({
    name:'admin',
    initialState,
    reducers:{
        setPage: (state,action) => {
            state.currentPage = action.payload;
        },
        setSearch:(state,action) => {
            state.searchQuery = action.payload;
            state.currentPage = 1;
        }
    },
    extraReducers:(builder) => {
        builder
        .addCase(fetchUsers.pending,(state) => {
            state.loading = true;
        })
        .addCase(fetchUsers.fulfilled, (state,action) => {
            state.users = action.payload.users;
            state.currentPage = action.payload.currentPage;
            state.totalPages = action.payload.totalPages;
            state.totalUsers = action.payload.totalUsers;
            state.hasNext = action.payload.hasNext;
            state.hasPrev = action.payload.hasPrev;
            state.loading = false;
        })
        .addCase(fetchUsers.rejected,(state,action) => {
            state.loading = false;
            state.error = action.payload;
        })

        .addCase(editUser.pending,(state) => {
                state.loading = true;
        })
        .addCase(editUser.fulfilled, (state,action) => {
                state.loading = false;
                const index = state.users.findIndex(user => user._id === action.payload._id);
                if(index!==-1){
                    state.users[index] = action.payload;
                }
        })
        .addCase(editUser.rejected, (state,action) => {
                state.loading = false;
                state.error = action.payload;
        })

        .addCase(deleteUser.pending,(state) => {
                state.loading = true;
        })
        .addCase(deleteUser.fulfilled, (state,action) => {
                state.loading = false;
                state.users = state.users.filter((user) => user._id.toString() !== action.meta.arg);
        })
        .addCase(deleteUser.rejected, (state,action) => {
                state.loading = false;
                state.error = action.payload;
        })

        .addCase(createUser.pending,(state) => {
            state.loading = true;
        })
        .addCase(createUser.fulfilled,(state,action) => {
            state.loading = false;
            state.users = [...state.users,action.payload];
        })
        .addCase(createUser.rejected,(state,action) => {
            state.loading = false;
            state.error = action.payload;
        })
    }
})

export const { setPage, setSearch } = adminSlice.actions; 
export default adminSlice.reducer;