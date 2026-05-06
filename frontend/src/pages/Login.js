import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    
    const result = await login(email, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const isFormValid = email.length > 0 && password.length > 5;

  return (
    <div className="ig-auth-page">
      <div className="ig-auth-main">
        <div className="ig-auth-box">
          <div className="ig-auth-logo">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png" alt="Instagram" className="ig-auth-logo-img" />
          </div>
          
          <form className="ig-auth-form" onSubmit={handleSubmit}>
            <div className="ig-auth-input-group">
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Phone number, username, or email"
                autoComplete="off"
              />
            </div>
            
            <div className="ig-auth-input-group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="off"
              />
            </div>
            
            <button 
              type="submit" 
              className="ig-auth-submit" 
              disabled={!isFormValid || loading}
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
            
            {error && <div className="ig-auth-error">{error}</div>}
            
            <div className="ig-auth-divider">
              <div className="ig-line"></div>
              <div className="ig-or">OR</div>
              <div className="ig-line"></div>
            </div>
            
            <div className="ig-auth-fb">
              <span className="ig-fb-icon"></span>
              <span className="ig-fb-text">Log in with Facebook</span>
            </div>
            
            <a href="#" className="ig-auth-forgot">
              Forgot password?
            </a>
          </form>
        </div>
        
        <div className="ig-auth-signup-box">
          <p>
            Don't have an account? <Link to="/register">Sign up</Link>
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

export default Login;