import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
      return `http://localhost:5001/uploads/${user.profilePicture}`;
    }
    return '/default-avatar.png';
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Safe Connect
        </Link>

        <div className="nav-menu">
          {!user ? (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link">
                Register
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <Link to="/messages" className="nav-link">
                Messages
              </Link>
              <Link to="/feed" className="nav-link">
                Feed
              </Link>
              <div className="nav-user">
                <Link to="/profile" className="profile-link">
                  <img
                    src={getProfilePictureUrl()}
                    alt={user.name}
                    className="nav-avatar"
                  />
                </Link>
                <span className="nav-username">{user.name}</span>
                <button onClick={handleLogout} className="nav-logout-btn">
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;