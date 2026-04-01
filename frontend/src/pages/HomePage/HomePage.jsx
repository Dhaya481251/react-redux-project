import React, { useEffect } from 'react'
import Navbar from '../../components/Navbar/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, logout } from '../../features/auth/authSlice';

const HomePage = () => {
  const user = useSelector((state) => state.auth.currentUser);
  const error = useSelector((state) => state.auth.error);
  const dispatch = useDispatch();

  useEffect(() => {
    if(error){
      dispatch(logout('user'));
    }
  },[error])

  useEffect(() => {
    dispatch(fetchUser());
  },[user])

  return (
    <>
    <Navbar/>
    <h1>Welcome {user.name}</h1>
    </>
  )
}

export default HomePage
