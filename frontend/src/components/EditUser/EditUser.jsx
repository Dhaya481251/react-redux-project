import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // ← new import
import { useDispatch, useSelector } from 'react-redux';
import {  editUser, fetchUsers } from '../../features/admin/adminSlice';
import './EditUser.css';

const EditUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const targetUserId = queryParams.get('userId');

  const users = useSelector(state => state.admin.users);

  const userToEdit = users.find(user => user._id === targetUserId);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    profileImage: null,
  });

  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (!users.length) {
      dispatch(fetchUsers());
    }
  }, [dispatch, users.length]);

  useEffect(() => {
    if (userToEdit) {
      setFormData({
        name: userToEdit.name || '',
        email: userToEdit.email || '',
        password: '',
        confirmPassword: '',
        profileImage: null,
      });
      setPreview(userToEdit.profileImage ? `http://localhost:5000${userToEdit.profileImage}` : '');
    }
  }, [userToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, profileImage: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password && formData.password !== formData.confirmPassword) {
    //   toast.error('Passwords do not match');
    console.log('Password do not match')
      return;
    }

    if (!targetUserId) {
      console.log('No user selected to edit');
      return;
    }

    try {
      console.log('Hello try')
      const dataToSend = new FormData();
      dataToSend.append('name', formData.name);
      dataToSend.append('email', formData.email);
      for (let [key, value] of dataToSend.entries()) {
  console.log(key, value);
}
    console.log('formData : ',formData);
      if (formData.password) {
        dataToSend.append('password', formData.password);
        for (let [key, value] of dataToSend.entries()) {
  console.log(key, value);
}
      }

      if (formData.profileImage) {
        dataToSend.append('profileImage', formData.profileImage);
        if (formData.profileImage) {
  console.log('File details:', {
    name: formData.profileImage.name,
    size: formData.profileImage.size,
    type: formData.profileImage.type,
  });
}
      }

       let result = await dispatch(editUser({
        userId: targetUserId,
        formData: dataToSend,
      })).unwrap();

      console.log('result : ',result);
      // if(editUser.fulfilled.match(result)){
      //   navigate('/admin');
      // }

      // if(editUser.rejected.match(result)){
      //   console.log('failed');
      // }
      localStorage.setItem('adminUpdateUser',JSON.stringify({
        userId:targetUserId,
        updateAt: new Date().toISOString()
      }))
      window.dispatchEvent(new Event('storage'));
      console.log('User updated successfully');
      navigate("/admin");

    } catch (err) {
      console.error(err || 'Failed to update user');
    }
  };

  if (!userToEdit) return <div>User not found or invalid selection</div>;
  
  const handleCancel = () => {
    navigate('/admin');
  };

  return (
    <>
    <div className="edit">
      <div className="edit-title">
        <h1>Edit User Details</h1>
      </div>

      <form onSubmit={handleSubmit} className="edit-form">
        <div className="edit-input-field">
          <div className="preview-image">
            {preview ? (
              <img className='profile-preview-image' src={preview} alt="Profile preview" />
            ) : (
              <div className="no-image">No image</div>
            )}
          </div>
          <label htmlFor="profileImage" className="edit-label">Change Profile Image</label>
          <input type="file" id="profileImage" accept="image/*" onChange={handleFileChange} />
        </div>

        <div className="edit-input-field">
          <label className="edit-label">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="edit-input-field">
          <label className="edit-label">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="edit-input-field">
          <label className="edit-label">New Password (optional)</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className="edit-input-field">
          <label className="edit-label">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>

        <div className="edit-submit-btn">
          <button type="submit" className="admin-edit-btn">Edit</button>
          <button type="button" className='edit-cancel-btn' onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
    </>
  );
};

export default EditUser;