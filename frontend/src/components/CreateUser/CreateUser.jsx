import React, { useState } from 'react';
import './CreateUser.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../../features/admin/adminSlice';

const CreateUser = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    
    const {loading, error} = useSelector((state) => state.admin);
    
    const validateName = (value) => {
        let validName = /^[A-Za-z ]+$/;

        if(!value || value.trim() === ""){
            return "Name field is required"
        }else if(!validName.test(value)){
            return "Name can only contain letters and space";
        }
        return "";
    }

    const validateEmail = (value) => {
        let validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!value || value.trim() === ""){
            return "Email field is required";
        }else if(!validEmail.test(value)){
            return "Invalid email address";
        }
        return "";
    }

    const validatePassword = (value) => {
        let hasUpper = /[A-Z]/.test(value);
        let hasLower = /[a-z]/.test(value);
        let hasNumber = /[0-9]/.test(value);

        if(!value || value.trim() === ""){
            return "Password field is required";
        }else if(value.length<6){
            return "Password must have atleast 6 characters";
        }else if(!hasUpper || !hasLower || !hasNumber){
            return "Password must contain uppercase, lowercase and number"
        }
        return "";
    }

    const validateConfirmPassword = (value1,value2) => {
        if(!value1 || value1.trim() === ""){
            return "Confirm password field is required";
        }else if(value1 !== value2){
            return "Confirm password doesn't match password";
        }
        return "";
    }
    const handleNameChange = (e) => {
        const value = e.target.value;
        setName(value);
        setNameError(validateName(value));
    }

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        setEmailError(validateEmail(value));
    }

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        setPasswordError(validatePassword(value));
    }

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
        setConfirmPasswordError(validateConfirmPassword(value,password))
    }

    const submitHandler = async(e) => {
        e.preventDefault();

        const finalNameError = validateName(name);
        const finalEmailError = validateEmail(email);
        const finalPasswordError = validatePassword(password);
        const finalConfirmPasswordError = validateConfirmPassword(confirmPassword,password);

        setNameError(finalNameError);
        setEmailError(finalEmailError);
        setPasswordError(finalPasswordError);
        setConfirmPasswordError(finalConfirmPasswordError);

        if(finalNameError || finalEmailError || finalPasswordError || finalConfirmPasswordError){
            return;
        }

        try {
            await dispatch(createUser({name,email,password})).unwrap();
            navigate('/admin');
        } catch (err) {
            console.error(err);
        }
    }

    const handleCancel = () => {
        navigate('/admin')
    }

  return (
    <>
    <div className='create'>
      <div className="create-title">
        <h1>Create New User</h1>
      </div>
      <form className="create-form" onSubmit={submitHandler}>
        <div className="create-input-field">
            <label className="create-label">Name</label>
            <input type="text" name="name" value={name} onChange={handleNameChange}/>
            {nameError && <p className='error'>{nameError}</p>}
        </div>
        <div className="create-input-field">
            <label className="create-label">Email</label>
            <input type="email" name="email" value={email} onChange={handleEmailChange}/>
            {emailError && <p className='error'>{emailError}</p>}
        </div>
        <div className="create-input-field">
            <label className="create-label">Password</label>
            <input type="password" name="password" value={password} onChange={handlePasswordChange}/>
            {passwordError && <p className='error'>{passwordError}</p>}
        </div>
        <div className="create-input-field">
            <label className="create-label">Confirm Password</label>
            <input type="password" name="confirmPassword" value={confirmPassword} onChange={handleConfirmPasswordChange}/>
            {confirmPasswordError && <p className='error'>{confirmPasswordError}</p>}
        </div>
        <div className="create-submit-btn">
            <button type="submit" className='admin-create-btn' disabled={loading}>{loading ? 'Creating' : 'Create'}</button>
            <button type="button" className='create-cancel-btn' onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
    {error && <div className="create-error-container">{error}</div>}
    </>
  )
}

export default CreateUser
