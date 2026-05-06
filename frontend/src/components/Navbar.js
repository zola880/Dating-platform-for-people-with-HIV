import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import config from '../utils/config';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getProfilePictureUrl = () => {
    if (user?.profilePicture && user.profilePicture !== 'default-avatar.png') {
      return config.getUploadUrl(user.profilePicture);
    }
    return '/default-avatar.png';
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo Section */}
        <Link to="/" className="nav-logo">
          <span className="logo-icon">🐝</span>
          <span className="logo-text">Hivmedia</span>
        </Link>

        {/* Navigation Links */}
        <div className="nav-menu">
          {!user ? (
            <>
              <Link to="/login" className="nav-link">
                Sign In
              </Link>
              <Link to="/register" className="nav-link nav-link-primary">
                Get Started
              </Link>
            </>
          ) : (
            <>
              <Link to="/feed" className="nav-link">
                Home
              </Link>
              <Link to="/dashboard" className="nav-link">
                Explore
              </Link>
              <Link to="/messages" className="nav-link">
                Messages
              </Link>

              {/* Admin Link */}
              {(user?.role === 'admin' || user?.role === 'superadmin') && (
                <Link to="/admin" className="nav-link nav-link-admin">
                  Admin
                </Link>
              )}

              {/* User Profile Section */}
              <div className="nav-user-dropdown">
                <button className="nav-user-btn">
                  <img
                    src={getProfilePictureUrl()}
                    alt={user.name}
                    className="nav-avatar"
                  />
                  <span className="nav-username">{user.name}</span>
                  <svg className="dropdown-arrow" width="12" height="12" viewBox="0 0 12 12">
                    <path d="M6 8L2 4h8z" fill="currentColor"/>
                  </svg>
                </button>

                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    Profile
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="dropdown-item dropdown-item-danger">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16,17 21,12 16,7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;