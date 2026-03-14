import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, IconButton, Badge, Menu, MenuItem, Avatar
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Message as MessageIcon,
  AccountCircle
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/dashboard" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          HIV Connect Pro
        </Typography>

        {user && (
          <>
            <Button color="inherit" component={Link} to="/swipe">Find Matches</Button>
            <Button color="inherit" component={Link} to="/discover">Browse</Button>
            <Button color="inherit" component={Link} to="/groups">Groups</Button>
            <Button color="inherit" component={Link} to="/events">Events</Button>

            <IconButton color="inherit" component={Link} to="/messages">
              <Badge badgeContent={0} color="error">
                <MessageIcon />
              </Badge>
            </IconButton>

            <IconButton color="inherit" component={Link} to="/notifications">
              <Badge badgeContent={0} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <IconButton onClick={handleMenu} color="inherit">
              {user.profilePicture ? (
                <Avatar src={user.profilePicture} alt={user.username} />
              ) : (
                <AccountCircle />
              )}
            </IconButton>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
              <MenuItem onClick={() => { navigate(`/profile/${user._id}`); handleClose(); }}>
                My Profile
              </MenuItem>
              <MenuItem onClick={() => { navigate('/my-matches'); handleClose(); }}>
                My Matches
              </MenuItem>
              <MenuItem onClick={() => { navigate('/likes-received'); handleClose(); }}>
                Likes Received
              </MenuItem>
              <MenuItem onClick={() => { navigate('/edit-profile'); handleClose(); }}>
                Edit Profile
              </MenuItem>
              <MenuItem onClick={() => { navigate('/dating-preferences'); handleClose(); }}>
                Dating Preferences
              </MenuItem>
              {user.isAdmin && (
                <MenuItem onClick={() => { navigate('/admin'); handleClose(); }}>
                  Admin Panel
                </MenuItem>
              )}
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
