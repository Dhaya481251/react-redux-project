import React from 'react'
import { Outlet } from 'react-router-dom'

const AdminApp = () => {
  return (
    <>
    <div>
        <Outlet/>
    </div>
    </>
  )
}

export default AdminApp
