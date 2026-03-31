import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from '../../utils/api';

export const fetchUsers = createAsyncThunk('admin/fetchUsers',async(search='',{rejectWithValue}) => {
    try {
        const url = search ? `/admin/users?search=${encodeURIComponent(search.trim())}`:'/admin/users';
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

const initialState = {
    users:[],
    loading:false,
    error:null
}
const adminSlice = createSlice({
    name:'admin',
    initialState,
    reducers:{},
    extraReducers:(builder) => {
        builder
        .addCase(fetchUsers.pending,(state) => {
            state.loading = true;
        })
        .addCase(fetchUsers.fulfilled, (state,action) => {
            state.users = action.payload;
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
    }
})

export default adminSlice.reducer;