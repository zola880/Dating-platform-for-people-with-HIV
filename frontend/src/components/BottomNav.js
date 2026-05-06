import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import config from '../utils/config';
import './BottomNav.css';

// Using the same Icons as VerticalNavbar
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
  Create: ({ active }) => (
    <svg aria-label="New post" color="#262626" fill={active ? "#262626" : "none"} height="24" role="img" viewBox="0 0 24 24" width="24" stroke="currentColor" strokeWidth={active ? "0" : "2"}>
      <path d="M2 12v3.45c0 2.849.698 4.005 1.606 4.944.94.909 2.098 1.608 4.946 1.608h6.896c2.848 0 4.006-.7 4.946-1.608C21.302 19.455 22 18.3 22 15.45V8.552c0-2.849-.698-4.006-1.606-4.945C19.454 2.7 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.547 2 5.703 2 8.552z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
      <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" x1="6.545" x2="17.455" y1="12" y2="12"></line>
      <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" x1="12" x2="12" y1="6.545" y2="17.455"></line>
    </svg>
  ),
  Reels: ({ active }) => (
    <svg aria-label="Reels" color="#262626" fill={active ? "#262626" : "none"} height="24" role="img" viewBox="0 0 24 24" width="24" stroke="currentColor" strokeWidth={active ? "0" : "2"}>
      <line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="2.049" x2="21.95" y1="7.002" y2="7.002"></line>
      <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="13.504" x2="16.362" y1="2.001" y2="7.002"></line>
      <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="7.207" x2="10.002" y1="2.11" y2="7.002"></line>
      <path d="M2 12.001v3.449c0 2.849.698 4.006 1.606 4.945.94.908 2.098 1.607 4.946 1.607h6.896c2.848 0 4.006-.7 4.946-1.607.908-.939 1.606-2.096 1.606-4.945V8.552c0-2.848-.698-4.006-1.606-4.945C19.454 2.7 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.608C2.698 4.546 2 5.704 2 8.552z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
      <path d="M9.763 17.664a.908.908 0 01-.454-.787V11.63a.909.909 0 011.364-.788l4.545 2.624a.909.909 0 010 1.575l-4.545 2.624a.91.91 0 01-.91 0z" fill={active ? "#262626" : "none"} stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path>
    </svg>
  )
};

const BottomNav = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const getProfilePictureUrl = () => {
    if (user?.profilePicture && user.profilePicture !== 'default-avatar.png') {
      return config.getUploadUrl(user.profilePicture);
    }
    return '/default-avatar.png';
  };

  return (
    <nav className="ig-bottom-nav">
      <NavLink to="/feed" className="ig-bottom-nav-item">
        <Icons.Home active={location.pathname === '/feed'} />
      </NavLink>
      
      <NavLink to="/dashboard" className="ig-bottom-nav-item">
        <Icons.Search active={location.pathname === '/dashboard'} />
      </NavLink>
      
      <div className="ig-bottom-nav-item" onClick={() => document.getElementById('create-post-modal')?.style.setProperty('display', 'flex')}>
        <Icons.Create active={false} />
      </div>
      
      <NavLink to="/events" className="ig-bottom-nav-item">
        <Icons.Reels active={location.pathname === '/events'} />
      </NavLink>
      
      <NavLink to="/profile" className="ig-bottom-nav-item">
        <div className={`ig-bottom-nav-profile-pic ${location.pathname === '/profile' ? 'active' : ''}`}>
          <img src={getProfilePictureUrl()} alt="Profile" />
        </div>
      </NavLink>
    </nav>
  );
};

export default BottomNav;