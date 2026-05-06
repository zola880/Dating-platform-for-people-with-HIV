import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import './VerticalNavbar.css';
import { useAuth } from '../context/AuthContext';
import config from '../utils/config';

// Icons
const Icons = {
  Home: ({ active }) => (
    <svg aria-label="Home" color="#262626" fill={active ? "#262626" : "none"} height="24" role="img" viewBox="0 0 24 24" width="24" stroke="currentColor" strokeWidth={active ? "0" : "2"}>
      <path d="M9.005 16.545a2.997 2.997 0 012.997-2.997h0A2.997 2.997 0 0115 16.545V22h5V11.543L12 2 2 11.543V22h5v-5.455z" strokeLinejoin="round"></path>
    </svg>
  ),
  Search: ({ active }) => (
    <svg aria-label="Search" color="#262626" fill="none" height="24" role="img" viewBox="0 0 24 24" width="24" stroke="currentColor" strokeWidth={active ? "3" : "2"}>
      <path d="M19 10.5A8.5 8.5 0 1110.5 2a8.5 8.5 0 018.5 8.5z" strokeLinecap="round" strokeLinejoin="round"></path>
      <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" x1="16.511" x2="22" y1="16.511" y2="22"></line>
    </svg>
  ),
  Explore: ({ active }) => (
    <svg aria-label="Explore" color="#262626" fill={active ? "#262626" : "none"} height="24" role="img" viewBox="0 0 24 24" width="24" stroke="currentColor" strokeWidth={active ? "0" : "2"}>
      <polygon fill={active ? "#262626" : "none"} points="13.941 13.953 7.581 16.424 10.06 10.056 16.42 7.585 13.941 13.953" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></polygon>
      <polygon fill="none" points="13.941 13.953 7.581 16.424 10.06 10.056 16.42 7.585 13.941 13.953" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></polygon>
      <circle cx="12" cy="12" fill="none" r="9.25" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></circle>
    </svg>
  ),
  Messages: ({ active }) => (
    <svg aria-label="Messenger" color="#262626" fill={active ? "#262626" : "none"} height="24" role="img" viewBox="0 0 24 24" width="24" stroke="currentColor" strokeWidth={active ? "0" : "2"}>
      <path d="M12.003 2.001a9.705 9.705 0 11-5.83 17.54l-3.326.89a.52.52 0 01-.625-.627l.9-3.328a9.692 9.692 0 01-1.096-4.477 9.705 9.705 0 019.977-9.998z" fill={active ? "#262626" : "none"} stroke="currentColor" strokeLinejoin="round"></path>
    </svg>
  ),
  Notifications: ({ active }) => (
    <svg aria-label="Notifications" color="#262626" fill={active ? "#262626" : "none"} height="24" role="img" viewBox="0 0 24 24" width="24" stroke="currentColor" strokeWidth={active ? "0" : "2"}>
      <path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 013.679-1.938m0-2a6.04 6.04 0 00-4.797 2.127 6.052 6.052 0 00-4.787-2.127A6.985 6.985 0 00.5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 003.518 3.018 2 2 0 002.174 0 45.263 45.263 0 003.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 00-6.708-7.218z"></path>
    </svg>
  ),
  Create: ({ active }) => (
    <svg aria-label="New post" color="#262626" fill={active ? "#262626" : "none"} height="24" role="img" viewBox="0 0 24 24" width="24" stroke="currentColor" strokeWidth={active ? "0" : "2"}>
      <path d="M2 12v3.45c0 2.849.698 4.005 1.606 4.944.94.909 2.098 1.608 4.946 1.608h6.896c2.848 0 4.006-.7 4.946-1.608C21.302 19.455 22 18.3 22 15.45V8.552c0-2.849-.698-4.006-1.606-4.945C19.454 2.7 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.547 2 5.703 2 8.552z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
      <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" x1="6.545" x2="17.455" y1="12" y2="12"></line>
      <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" x1="12" x2="12" y1="6.545" y2="17.455"></line>
    </svg>
  ),
  More: () => (
    <svg aria-label="Settings" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
      <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="3" x2="21" y1="4" y2="4"></line>
      <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="3" x2="21" y1="12" y2="12"></line>
      <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="3" x2="21" y1="20" y2="20"></line>
    </svg>
  )
};

const VerticalNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getProfilePictureUrl = () => {
    if (user?.profilePicture && user.profilePicture !== 'default-avatar.png') {
      return config.getUploadUrl(user.profilePicture);
    }
    return '/default-avatar.png'; // Make sure you have a default avatar in public folder
  };

  const handleLogout = () => {
    logout?.();
    navigate('/login');
  };

  const isNarrow = windowWidth <= 768;

  if (!user) return null; // Only show for authenticated users, otherwise they just see the login screen

  return (
    <aside className="ig-sidebar">
      <div className="ig-sidebar-content">
        <Link to="/feed" className="ig-logo-container">
          {isNarrow ? (
            <svg aria-label="Instagram" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"></path>
            </svg>
          ) : (
            <div className="ig-logo-text">Instagram</div>
          )}
        </Link>

        <nav className="ig-nav-items">
          <NavLink to="/feed" className="ig-nav-item">
            <div className="ig-nav-icon"><Icons.Home active={location.pathname === '/feed'} /></div>
            {!isNarrow && <span className={`ig-nav-label ${location.pathname === '/feed' ? 'active' : ''}`}>Home</span>}
          </NavLink>

          <div className="ig-nav-item cursor-pointer">
            <div className="ig-nav-icon"><Icons.Search active={false} /></div>
            {!isNarrow && <span className="ig-nav-label">Search</span>}
          </div>

          <NavLink to="/dashboard" className="ig-nav-item">
            <div className="ig-nav-icon"><Icons.Explore active={location.pathname === '/dashboard'} /></div>
            {!isNarrow && <span className={`ig-nav-label ${location.pathname === '/dashboard' ? 'active' : ''}`}>Explore</span>}
          </NavLink>

          <NavLink to="/messages" className="ig-nav-item">
            <div className="ig-nav-icon"><Icons.Messages active={location.pathname === '/messages'} /></div>
            {!isNarrow && <span className={`ig-nav-label ${location.pathname === '/messages' ? 'active' : ''}`}>Messages</span>}
          </NavLink>

          <div className="ig-nav-item cursor-pointer">
            <div className="ig-nav-icon"><Icons.Notifications active={false} /></div>
            {!isNarrow && <span className="ig-nav-label">Notifications</span>}
          </div>

          <div className="ig-nav-item cursor-pointer" onClick={() => document.getElementById('create-post-modal')?.style.setProperty('display', 'flex')}>
            <div className="ig-nav-icon"><Icons.Create active={false} /></div>
            {!isNarrow && <span className="ig-nav-label">Create</span>}
          </div>

          <NavLink to="/profile" className="ig-nav-item">
            <div className={`ig-nav-profile-pic ${location.pathname === '/profile' ? 'active' : ''}`}>
              <img src={getProfilePictureUrl()} alt="Profile" />
            </div>
            {!isNarrow && <span className={`ig-nav-label ${location.pathname === '/profile' ? 'active' : ''}`}>Profile</span>}
          </NavLink>
        </nav>

        <div className="ig-nav-bottom">
          <div className="ig-nav-item cursor-pointer" onClick={handleLogout}>
            <div className="ig-nav-icon"><Icons.More /></div>
            {!isNarrow && <span className="ig-nav-label">More</span>}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default VerticalNavbar;