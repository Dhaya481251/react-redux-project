import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import demoProfileImage from '../../assets/userProfile.jpg'
import { fetchUser, updateProfileImage } from "../../features/auth/authSlice";
import "./Profile.css";
import Navbar from '../Navbar/Navbar.jsx';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

function Profile() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.currentUser);
  const loading = useSelector((state) => state.auth.loading);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageError, setImageError] = useState("");

  const fileInputRef = useRef(null);
  
  const handlePenClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    
    if(!file) return;

    if(!file.type.startsWith('image/')){
      setImageError("Please select a valid image file");
      return;
    }
    
    setImageError("");
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log('user details for profile image : ',user);
    if(!selectedFile){
      setImageError("No file selected")
      return;
    }

    const formData = new FormData();
    formData.append('profileImage',selectedFile);
    try {
      await dispatch(updateProfileImage(formData)).unwrap();

      setSelectedFile(null);
      setPreviewUrl(null);
      setImageError("");
      
      if(fileInputRef.current){
        fileInputRef.current.value = "";
      }
    } catch (err) {
      const errMsg = err?.message;
      console.error(err || 'Failed to upload profile image');
      setImageError(errMsg);
    }
  };


  return (
    <>
    <Navbar/>
    <div className="profile-page">
      <h1>My Profile</h1>
      <div className="profile-card">
        <div className="profile-image-container">
          <img
          src={user.profileImage ? `http://localhost:5000${user.profileImage}` : demoProfileImage}
          alt="Profile"
          className="profile-img" onError={(e) => 
            {
              e.target.onerror = null;
              e.target.src = demoProfileImage
            }}
          />
          <div className="edit-icon-overlay" onClick={handlePenClick}>
            <FontAwesomeIcon icon={faPen} />
            <div className="tooltip">Change Profile Picture</div>
          </div>
        </div>
        <h3><strong>{user.name}</strong></h3>
        <div className="user-details">
          <p><strong>Email:</strong> {user.email}</p>
          {/* <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} style={{display:'none'}}/>
          {previewUrl && (
            <div className="preview-section">
              <p>Preview : </p>
              <img src={previewUrl} alt="Preview" className="preview-img" />
            </div>
          )}
          {selectedFile && (
            <div className="upload-actions">
              <button type="button" onClick={handleSubmit} disabled={loading}>{loading ? "Uploading":"Upload New Image"}</button>
              <button type="button" className="cancel-btn" onClick={() => {
                setSelectedFile(null);
                setPreviewUrl(null);
                setImageError("");
                if(fileInputRef.current) fileInputRef.current.value="";
                }}>Cancel</button>
            </div>
          )}
          {imageError && <p className="image-error">{imageError}</p>} */}
          <div className="upload-section">
            <form method="post" onSubmit={handleSubmit}>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} style={{display:'none'}} />
                {imageError && <p style={{color:'red'}}>{imageError}</p>}
                {previewUrl && (
                  <div className="preview-section">
                    <p>Preview : </p>
                    <img src={previewUrl} alt="Preview" className="preview-img"/>
                  </div>
                )}
                {selectedFile && (
                  <div className='upload-actions'>
                    <button type="submit" disabled={loading}>{loading ? "Uplaoding" : "Upload New Image"}</button>
                    <button type="button" className="cancel-btn" onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                      setImageError("");
                      if(fileInputRef.current) fileInputRef.current.value = "";
                    }}>Cancel</button>
                  </div>
                )}
            </form>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Profile;


