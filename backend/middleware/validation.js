import { body, validationResult } from 'express-validator';

export const validateRegister = [
  body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('age').isInt({ min: 18 }).withMessage('Must be at least 18 years old'),
  body('gender').isIn(['male', 'female', 'non-binary', 'other', 'prefer-not-to-say']).withMessage('Invalid gender'),
  body('country').notEmpty().withMessage('Country is required')
];

export const validateLogin = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

export const validatePost = [
  body('text').trim().isLength({ min: 1, max: 1000 }).withMessage('Post text must be between 1 and 1000 characters')
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
