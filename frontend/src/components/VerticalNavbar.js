import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import './VerticalNavbar.css';

// ⚠️ UPDATE THIS IMPORT to match your actual auth context path
// Common paths: '../context/AuthContext', '../hooks/useAuth', '../providers/AuthProvider'
import { useAuth } from '../context/AuthContext';

// Optional: Import config if you use it for avatar URLs
// import config from '../utils/config';

const VerticalNavbar = ({ 
  collapsed = false, 
  onToggleCollapse,
  onMobileClose 
}) => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Sync collapsed state with prop
  useEffect(() => {
    setIsCollapsed(collapsed);
  }, [collapsed]);

  // Close mobile menu on route change
  useEffect(() => {
    if (onMobileClose) {
      const handleRouteChange = () => {
        setIsMobileOpen(false);
        onMobileClose();
      };
      // Listen for navigation (React Router v6)
      return navigate.listen(handleRouteChange);
    }
  }, [navigate, onMobileClose]);

  // Handle Escape key to close mobile menu
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isMobileOpen) {
        setIsMobileOpen(false);
        onMobileClose?.();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isMobileOpen, onMobileClose]);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onToggleCollapse?.(newState);
  };

  const toggleMobile = () => {
    const newState = !isMobileOpen;
    setIsMobileOpen(newState);
    if (!newState) onMobileClose?.();
  };

  const handleLogout = () => {
    logout?.();
    navigate('/');
    setIsMobileOpen(false);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const getAvatarUrl = (user) => {
    // If you have config.getUploadUrl, use it:
    // if (user?.profilePicture && user.profilePicture !== 'default-avatar.png') {
    //   return config.getUploadUrl(user.profilePicture);
    // }
    // return '/default-avatar.png';
    
    // Fallback: return null to show initials
    return null;
  };

  // Navigation items for authenticated users
  const userNavItems = [
    { path: '/feed', icon: '🏠', label: 'Home', color: 'var(--primary-red)' },
    { path: '/dashboard', icon: '🌟', label: 'Explore', color: 'var(--accent-orange)' },
    { path: '/messages', icon: '💬', label: 'Messages', color: '#660708' },
    { path: '/events', icon: '🎉', label: 'Events', color: 'var(--primary-red)' },
    { path: '/health', icon: '❤️', label: 'Health', color: '#660708' },
  ];

  // Admin-only item
  const adminItem = (user?.role === 'admin' || user?.role === 'superadmin')
    ? { path: '/admin', icon: '⚙️', label: 'Admin', badge: 'Pro', color: '#660708' }
    : null;

  // Public navigation items
  const publicNavItems = [
    { path: '/', icon: '🏠', label: 'Home', color: 'var(--primary-red)' },
    { path: '/login', icon: '🔑', label: 'Sign In', color: 'var(--accent-orange)' },
    { path: '/register', icon: '✨', label: 'Join Community', color: '#660708' },
  ];

  const navItems = user ? userNavItems : publicNavItems;

  // Loading state
  if (loading) {
    return (
      <aside className="vertical-navbar" aria-busy="true">
        <div className="navbar-header">
          <div className="logo-icon" style={{ opacity: 0.6 }}>Z</div>
        </div>
        <div style={{ padding: '1rem', opacity: 0.5 }}>Loading...</div>
      </aside>
    );
  }

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="navbar-overlay visible" 
          onClick={() => { setIsMobileOpen(false); onMobileClose?.(); }}
          aria-hidden="true"
        />
      )}

      <aside 
        className={`vertical-navbar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Header */}
        <header className="navbar-header">
          <Link 
            to="/" 
            className="navbar-logo"
            onClick={() => { setIsMobileOpen(false); onMobileClose?.(); }}
          >
            <span className="logo-icon" aria-hidden="true">🐝</span>
            {!isCollapsed && <span className="logo-text">Hivmedia</span>}
          </Link>
          
          <button
            className="collapse-btn"
            onClick={toggleCollapse}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!isCollapsed}
            aria-controls="navbar-nav"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        </header>

        {/* Profile section (authenticated users only) */}
        {user && (
          <div className="profile-section">
            <NavLink 
              to="/profile" 
              className="profile-link"
              onClick={() => { setIsMobileOpen(false); onMobileClose?.(); }}
            >
              <div className="profile-avatar-wrapper">
                <div className="profile-avatar">
                  {getAvatarUrl(user) ? (
                    <img 
                      src={getAvatarUrl(user)} 
                      alt={`${user.name}'s avatar`}
                      onError={(e) => { 
                        e.target.style.display = 'none';
                        e.target.nextSibling?.style?.display === 'none' && 
                        (e.target.nextSibling.style.display = 'flex');
                      }}
                    />
                  ) : null}
                  <span style={{ display: getAvatarUrl(user) ? 'none' : 'flex' }}>
                    {getInitials(user.name)}
                  </span>
                </div>
                <span className="profile-status" aria-label="Online"></span>
              </div>
              
              {!isCollapsed && (
                <div className="profile-info">
                  <span className="profile-name">{user.name}</span>
                  <span className="profile-email">{user.email}</span>
                </div>
              )}
            </NavLink>
          </div>
        )}

        {/* Navigation links */}
        <nav className="navbar-items" id="navbar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => { setIsMobileOpen(false); onMobileClose?.(); }}
              title={isCollapsed ? item.label : undefined}
            >
              <span className="nav-icon" style={{ color: item.color }} aria-hidden="true">
                {item.icon}
              </span>
              {!isCollapsed && (
                <>
                  <span className="nav-label">{item.label}</span>
                  {item.badge && <span className="nav-badge">{item.badge}</span>}
                </>
              )}
            </NavLink>
          ))}

          {adminItem && (
            <NavLink
              to={adminItem.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => { setIsMobileOpen(false); onMobileClose?.(); }}
              title={isCollapsed ? adminItem.label : undefined}
            >
              <span className="nav-icon" style={{ color: adminItem.color }} aria-hidden="true">
                {adminItem.icon}
              </span>
              {!isCollapsed && (
                <>
                  <span className="nav-label">{adminItem.label}</span>
                  {adminItem.badge && <span className="nav-badge">{adminItem.badge}</span>}
                </>
              )}
            </NavLink>
          )}
        </nav>

        {/* Footer / Logout (authenticated users only) */}
        {user && (
          <footer className="navbar-footer">
            <button 
              className="logout-btn" 
              onClick={handleLogout}
              title={isCollapsed ? 'Sign out' : undefined}
              type="button"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              {!isCollapsed && <span>Sign Out</span>}
            </button>
          </footer>
        )}
      </aside>
    </>
  );
};

export default VerticalNavbar;