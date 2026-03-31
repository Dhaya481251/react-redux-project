import React, { useEffect, useState } from 'react';
import '../../../public/css/Form.css'
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../features/auth/authSlice';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, error, loading } = useSelector((state) => state.auth);
  
 useEffect(() => {
    if (currentUser) {
      navigate('/', { replace: true });
    }
  }, [currentUser, navigate]);
  
  // Validation functions
  const validateEmail = (value) => {
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!value || value.trim() === "") {
      return "Email field is required";
    } else if (!validEmail.test(value)) {
      return "Invalid email address";
    }
    return "";
  };

  const validatePassword = (value) => {
    if (!value || value.trim() === "") {
      return "Password field is required";
    } else if (value.length < 6) {
      return "Password must have at least 6 characters";
    } else if (
      !/[A-Z]/.test(value) || 
      !/[a-z]/.test(value) || 
      !/[0-9]/.test(value)
    ) {
      return "Password must contain uppercase, lowercase, and numbers";
    }
    return "";
  };


  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateEmail(value));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(validatePassword(value));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const finalEmailError = validateEmail(email);
    const finalPasswordError = validatePassword(password);

    setEmailError(finalEmailError);
    setPasswordError(finalPasswordError);

    if (finalEmailError || finalPasswordError) {
      return; 
    }

    try {
      await dispatch(loginUser({ email, password })).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
    <div className='form'>
      <form className="form-card" onSubmit={submitHandler}>
        <h1>Login</h1>
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
          <div className='input-with-icon'>
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
          <button type='submit' disabled={loading}>{loading ?'Logging in...' : 'Login'}</button>
        </div>

        <p style={{fontSize:'15px'}}>
          New to Puzl Mart? <NavLink to="/register" style={{ color: 'white' }}>Sign Up</NavLink>
        </p>
      </form>
    </div>
    {error && <div className="error-container">{error}</div>}
    </>
  );
};

export default LoginForm;
