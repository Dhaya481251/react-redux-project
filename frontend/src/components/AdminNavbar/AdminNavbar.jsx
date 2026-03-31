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
    const [hover,setHover] = useState(false)


    const handleHover = () => setHover(true);
    const removeHover = () => setHover(false);

    const { currentUser,role } = useSelector((state) => state.auth);

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
                <li onMouseEnter={handleHover}>
                    <img className='profile-image' src={currentUser.profileImage ? `http://localhost:5000${currentUser.profileImage}` : demoProfileImage} alt="" />{currentUser.name} <span>
                        {
                        hover===true ? <img className="arrow" src={upArrow} alt="" /> : 
                        <img className="arrow" src={downArrow} alt=""/>
                        }
                        </span>
                    {(currentUser && role==='admin' && hover) && (
                        <div className="user-list" onMouseLeave={removeHover}>
                            <ul>
                                <li>My Profile <span><img className="arrow" src={rightArrow} alt="" /></span></li>
                            </ul>
                        </div>
                    )}
                </li>
                <li><button className='login-btn' onClick={logoutHandler}>Logout</button></li>
            </div>
        </ul>
      </nav>
  )
}

export default AdminNavbar;
