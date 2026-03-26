const User = require('../models/User');

/**
 * Admin middleware - checks if user has admin role
 * Use after protect middleware
 */
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.role !== 'admin' && user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Super admin middleware - checks if user has super admin role
 */
const isSuperAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Access denied. Super admin privileges required.' });
    }
    
    next();
  } catch (error) {
    console.error('Super admin middleware error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { isAdmin, isSuperAdmin };