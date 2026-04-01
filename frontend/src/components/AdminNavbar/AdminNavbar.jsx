import React, { useState } from 'react';
import '../../../public/css/Navbar.css';
import downArrow from '../../assets/downArrow.svg';
import upArrow from '../../assets/upArrow.svg';
import rightArrow from '../../assets/rightArrow.svg';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import demoProfileImage from '../../assets/userProfile.jpg';

const AdminNavbar = () => {
    const { currentUser } = useSelector((state) => state.auth.currentUser);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = async() => {
        try {
            await dispatch(logout('admin')).unwrap();
            navigate('/admin/login',{replace:true});
        } catch (err) {
            console.error("Logout failed : ",err);
        }
    }
  return (
      <nav>
        <ul>
            <div className='lists'>
                <li className='logo'>Puzl Mart</li>
                <li><NavLink to='/admin' className='home-user'>Home</NavLink></li>
            </div>
            <div className='lists'>
                <li>
                    <img className='profile-image' src={currentUser.profileImage ? `http://localhost:5000${currentUser.profileImage}` : demoProfileImage} alt="" />{currentUser.name} 
                </li>
                <li><button className='login-btn' onClick={logoutHandler}>Logout</button></li>
            </div>
        </ul>
      </nav>
  )
}

export default AdminNavbar;
