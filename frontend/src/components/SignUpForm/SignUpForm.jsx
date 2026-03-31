import React, { useEffect, useState } from 'react';
import '../../../public/css/Form.css'
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearError , registerUser } from '../../features/auth/authSlice';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faEye, faEyeSlash, faLock, faUser } from '@fortawesome/free-solid-svg-icons';

const SignUpForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, error , loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if(currentUser){
      navigate('/',{replace:true});
    }
  },[currentUser,navigate]);

  const validateName = (value) => {
    let validName = /^[A-Za-z ]+$/

    if(!value || value.trim() === ""){
        return "Name field is required";
    }else if(!validName.test(name)){
        return "Name can only contain letters and spaces";
    }
    return "";
  }

  const validateEmail = (value) => {
    let validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!value || value.trim() === "") {
      return "Email field is required";
    } else if (!validEmail.test(email)) {
      return "Invalid email address";
    }
    return "";
  };

  const validatePassword = (value) => {
    let hasUpper = /[A-Z]/.test(password);
    let hasLower = /[a-z]/.test(password);
    let hasNumber = /[0-9]/.test(password);

    if (!value || value.trim() === "") {
      return "Password field is required";
    } else if (value.length < 6) {
      return "Password must have at least 6 characters";
    } else if (!hasUpper || !hasLower || !hasNumber) {
      return "Password must contain uppercase, lowercase, and numbers";
    }
    return "";
  };

  const validateConfirmPassword = (value1,value2) => {
    if (!value1 || value1.trim() === "") {
        return "Confirm password is required";
    } else if (value1 !== value2) {
        return "Confirm password doesn't match password";
    }
    return "";
  };
  
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
    setConfirmPasswordError(validateConfirmPassword(value,password));
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
      await dispatch(registerUser({name,email,password}));
      navigate('/login')
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
    <div className='form'>
      <form className="form-card" onSubmit={submitHandler}>
        <h1>SignUp</h1>
        <div className="input-label">
          <label>Name</label>
          <div className="input-with-icon">
            <FontAwesomeIcon icon={faUser} className='input-icon'/>
            <input 
            type="text" 
            name="name" 
            value={name} 
            onChange={handleNameChange}
            disabled={loading}
          />
          </div>
          {nameError && <p className="error">{nameError}</p>}
        </div>
        <div className="input-label">
          <label>Email</label>
          <div className="input-with-icon">
            <FontAwesomeIcon icon={faEnvelope} className='input-icon'/>
            <input 
            type="email" 
            name="email" 
            value={email}
            onChange={handleEmailChange} 
            disabled={loading}
          />
          </div>
          {emailError && <p className='error'>{emailError}</p>}
        </div>
        <div className="input-label">
          <label>Password</label>
          <div className="input-with-icon">
            <FontAwesomeIcon icon={faLock} className='input-icon'/>
            <input 
            type={showPassword ? "text" : "password"} 
            name="password" 
            value={password}
            onChange={handlePasswordChange} 
            disabled={loading}
          />
          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className='toggle-password-icon' onClick={() => setShowPassword(!showPassword)}/>
          </div>
          {passwordError && <p className='error'>{passwordError}</p>}
        </div>
        <div className="input-label">
          <label>Confirm Password</label>
          <div className="input-with-icon">
            <FontAwesomeIcon icon={faLock} className='input-icon'/>
            <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            disabled={loading}
          />
          <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} className='toggle-password-icon' onClick={() => setShowConfirmPassword(!showConfirmPassword)}/>
          </div>
          {confirmPasswordError && <p className="error">{confirmPasswordError}</p>}
        </div>
        <div className="input-label">
          <button type='submit' disabled={loading}>{loading ? 'Signing up...' : "SignUp"}</button>
        </div>
        <p style={{fontSize:'15px'}}>Already have an account? <NavLink to="/login" style={{color:'white'}}>Login</NavLink></p>
      </form>
    </div>
    {error && <div className='error-container'>{error}</div>}
    </>
  );
};

export default SignUpForm;
