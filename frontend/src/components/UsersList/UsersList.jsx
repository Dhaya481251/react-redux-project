import React, { use, useEffect, useState } from 'react';
import './UsersList.css';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, deleteUser, setPage, setSearch } from '../../features/admin/adminSlice';
import demoProfileImage from '../../assets/userProfile.jpg';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import ConfirmAlert from '../ConfirmAlert/ConfirmAlert';

const UsersList = () => {
  const dispatch = useDispatch();
  const {users,loading,error,currentPage,totalPages,hasNext,hasPrev,searchQuery,admin} = useSelector((state) => state.admin);
  const [searchTerm, setSearchTerm] = useState('');
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers({search:searchQuery,page:currentPage}))
  },[dispatch,searchQuery,currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setSearch(searchTerm.trim()));
  }

  const handleClear = () => {
    setSearchTerm('');
    dispatch(setSearch(''));
  }

  const handleDeleteClick = (userId) => {
    setSelectedUserId(userId);
    setOpenConfirm(true);
  }

  const handleDelete = async (userId) => {
    try {
      await dispatch(deleteUser(selectedUserId)).unwrap();
      dispatch(fetchUsers({search:searchQuery,page:currentPage}));
    } catch (err) {
      console.error('Delete error:', err);
    } finally{
      setOpenConfirm(false);
    }
  };
  return (
    <div className="users-list">
      <h1 className="list-heading">Users Management</h1>
      <div className="search-container">
        <form onSubmit={handleSearch} className='search-form'>
          <div className="search-input-wrapper">
        <input
          type="text"
          placeholder="Search by username or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button type='button' className='clear-btn' onClick={handleClear}>
            <FontAwesomeIcon icon={faTimes}/>
          </button>
        )}
        </div>
        <button type='submit' className='search-btn' disabled={loading}>
          {loading ? 'Searching...' : <FontAwesomeIcon icon={faSearch}/>}
        </button>
        </form>
        <NavLink to='/admin/createUser'><button className='create-btn'>Create New User</button></NavLink>
      </div>
      {users.length === 0 ? (
        <p style={{color:'black',textAlign:'center',fontWeight:'800',fontSize:'1.5rem',marginTop:'10rem'}}>No users found</p>
      ) : (
        <>
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
                    <button className="delete-btn" onClick={() => handleDeleteClick(user._id)}>Delete</button>
                    <ConfirmAlert open={openConfirm} message="Are you sure you want to delete the user?" onConfirm={handleDelete} onCancel={() => setOpenConfirm(false)}/>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination-container">
          <button className="prev-btn" onClick={() => dispatch(setPage(currentPage-1))} disabled={!hasPrev || loading}>Prev</button>
          <span className='page-info'>{currentPage}</span>
          <button className="next-btn" onClick={() => dispatch(setPage(currentPage+1))} disabled={!hasNext || loading}>Next</button>
        </div>
        </>
      )}
    </div>
  );
};

export default UsersList;