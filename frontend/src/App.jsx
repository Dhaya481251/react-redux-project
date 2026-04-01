import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'

const App = () => {
  return (
    <>
    <div>
      <Outlet/>
    </div>
    </>
  )
}

export default App
