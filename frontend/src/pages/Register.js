import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Register.css'; // Will reuse some styles from Login.css structure

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: '',
    bio: '',
    profilePicture: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await register(formData);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const isFormValid = formData.email && formData.name && formData.password && formData.age && formData.gender && formData.confirmPassword;

  return (
    <div className="ig-auth-page">
      <div className="ig-auth-main">
        <div className="ig-auth-box ig-register-box">
          <div className="ig-auth-logo">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png" alt="Instagram" className="ig-auth-logo-img" />
          </div>
          
          <h2 className="ig-register-subtitle">
            Sign up to see photos and videos from your friends.
          </h2>
          
          <div className="ig-register-fb-btn">
            <span className="ig-fb-icon-white"></span>
            Log in with Facebook
          </div>
          
          <div className="ig-auth-divider">
            <div className="ig-line"></div>
            <div className="ig-or">OR</div>
            <div className="ig-line"></div>
          </div>
          
          {error && <div className="ig-auth-error">{error}</div>}
          
          <form className="ig-auth-form" onSubmit={handleSubmit}>
            <div className="ig-auth-input-group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
                required
              />
            </div>
            
            <div className="ig-auth-input-group">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                required
              />
            </div>
            
            <div className="ig-auth-input-group ig-flex-row">
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Age"
                min="18"
                max="120"
                required
                style={{ flex: 1, marginRight: '4px' }}
              />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                style={{ flex: 1, marginLeft: '4px' }}
              >
                <option value="" disabled hidden>Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Prefer not to say">Other</option>
              </select>
            </div>
            
            <div className="ig-auth-input-group">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
              />
            </div>
            
            <div className="ig-auth-input-group">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
              />
            </div>
            
            <p className="ig-register-terms">
              People who use our service may have uploaded your contact information to Instagram. <a href="#">Learn More</a>
              <br/><br/>
              By signing up, you agree to our <a href="#">Terms</a> , <a href="#">Privacy Policy</a> and <a href="#">Cookies Policy</a> .
            </p>
            
            <button 
              type="submit" 
              className="ig-auth-submit" 
              disabled={!isFormValid || loading}
            >
              {loading ? 'Signing up...' : 'Sign up'}
            </button>
          </form>
        </div>
        
        <div className="ig-auth-signup-box">
          <p>
            Have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
        
        <div className="ig-auth-get-app">
          <p>Get the app.</p>
          <div className="ig-auth-app-stores">
            <img src="https://static.cdninstagram.com/rsrc.php/v3/yt/r/Yfc020c87j0.png" alt="Get it on Google Play" />
            <img src="https://static.cdninstagram.com/rsrc.php/v3/yz/r/c5Rp7Ym-Klz.png" alt="Get it from Microsoft" />
          </div>
        </div>
      </div>
      
      <div className="ig-auth-footer">
        <div className="ig-auth-footer-links">
          <span>Meta</span>
          <span>About</span>
          <span>Blog</span>
          <span>Jobs</span>
          <span>Help</span>
          <span>API</span>
          <span>Privacy</span>
          <span>Terms</span>
          <span>Locations</span>
          <span>Instagram Lite</span>
          <span>Threads</span>
          <span>Contact Uploading & Non-Users</span>
          <span>Meta Verified</span>
        </div>
        <div className="ig-auth-footer-copyright">
          <select className="ig-language-select">
            <option value="en">English</option>
          </select>
          <span>© 2026 Instagram from Meta</span>
        </div>
      </div>
    </div>
  );
};

export default Register;