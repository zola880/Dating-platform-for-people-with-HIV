import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './BottomNav.css';

const BottomNav = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = user ? [
    { path: '/feed', icon: '🏠', label: 'Home' },
    { path: '/dashboard', icon: '👥', label: 'Explore' },
    { path: '/messages', icon: '💬', label: 'Messages' },
    { path: '/profile', icon: '👤', label: 'Profile' },
  ] : [
    { path: '/', icon: '🏠', label: 'Home' },
    { path: '/login', icon: '🔑', label: 'Login' },
    { path: '/register', icon: '📝', label: 'Sign Up' },
  ];

  return (
    <div className="bottom-nav">
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
    </div>
  );
};

export default BottomNav;