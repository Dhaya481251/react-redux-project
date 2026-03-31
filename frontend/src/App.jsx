import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'

const App = () => {
  const errorUser = useSelector((state) => state.auth.error);
  const errorAdmin = useSelector((state) => state.admin.error);

  return (
    <>
    <div>
      <Outlet/>
    </div>
    </>
  )
}

export default App
