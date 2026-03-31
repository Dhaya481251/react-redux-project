import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({children}) => {
    const currentUser = useSelector((state) => state.auth.currentUser);
    if(!currentUser){
        return <Navigate to='/login' replace/>
    }
    return <>{children}</>
}

export default ProtectedRoute
