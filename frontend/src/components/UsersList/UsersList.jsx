import React, { use, useEffect, useState } from 'react';
import './UsersList.css';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, deleteUser } from '../../features/admin/adminSlice';
import demoProfileImage from '../../assets/userProfile.jpg';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const UsersList = () => {
  const dispatch = useDispatch();
  const {users,loading,error} = useSelector((state) => state.admin);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchUsers(''))
  },[dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchTerm.trim());
    dispatch(fetchUsers(searchTerm.trim()));
  }

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to elete this user?')) return;

    try {
      await dispatch(deleteUser(userId)).unwrap();
      dispatch(fetchUsers(searchQuery));
    } catch (err) {
      console.error('Delete error:', err);
    } 
  };
  return (
    <div className="users-list">
      <h1 className="list-heading">Users Management</h1>
      <div className="search-container">
        <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by username or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button type='submit' className='search-btn'>
          {loading ? 'searching...' : <FontAwesomeIcon icon={faSearch}/>}
        </button>
        </form>
      </div>
      {users.length === 0 ? (
        <p style={{ width: '100%',color:'black' }}>No users found</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Profile Image</th>
              <th>Username</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>
                  <img
                    className="user-profile"
                    src={
                      user.profileImage
                        ? `http://localhost:5000${user.profileImage}`
                        : demoProfileImage
                    }
                    alt=""
                  />
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <div className="action-buttons">
                    <button className="edit-btn">
                      <NavLink to={`/admin/editUser?userId=${user._id}`} style={{textDecoration:'none',color:'white'}}>Edit</NavLink>
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(user._id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UsersList;