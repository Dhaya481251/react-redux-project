import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const AdminProtectedRoute = ({children}) => {
    const {currentUser,role} = useSelector((state) => state.auth);
    if(!currentUser){
        return <Navigate to='/admin/login' replace/>
    }else if(currentUser && role!=='admin'){
        return <Navigate to='/login/admin' replace/>
    }

    return <>{children}</>
}

export default AdminProtectedRoute
