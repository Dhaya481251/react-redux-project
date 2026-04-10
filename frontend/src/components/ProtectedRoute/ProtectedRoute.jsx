import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({children}) => {
    const {currentUser,role} = useSelector((state) => state.auth);

    if(!currentUser){
        return <Navigate to='/login' replace/>
    }else if(currentUser && role !== 'user'){
        return <Navigate to='/admin' replace/>
    }
    return <>{children}</>
}

export default ProtectedRoute
