import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './VerticalNavbar.css';

const VerticalNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Navigation items for logged-in users
  const userNavItems = [
    { path: '/feed', icon: '🏠', label: 'Home' },
    { path: '/dashboard', icon: '👥', label: 'Explore' },
    { path: '/messages', icon: '💬', label: 'Messages' },
    { path: '/profile', icon: '👤', label: 'Profile' },
  ];

  // Items for public users
  const publicNavItems = [
    { path: '/', icon: '🏠', label: 'Home' },
    { path: '/login', icon: '🔑', label: 'Login' },
    { path: '/register', icon: '📝', label: 'Sign Up' },
  ];

  const navItems = user ? userNavItems : publicNavItems;

  return (
    <div className="vertical-navbar">
      <div className="navbar-logo">
        <span>Embrace</span>
      </div>
      <nav className="navbar-items">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
        {user && (
          <button onClick={handleLogout} className="nav-item logout-btn">
            <span className="nav-icon">🚪</span>
            <span className="nav-label">Logout</span>
          </button>
        )}
      </nav>
    </div>
  );
};

export default VerticalNavbar;