import { body, validationResult } from 'express-validator';

const validateRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('phone')
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('policyNumber')
    .optional()
    .isLength({ min: 3 })
    .withMessage('Policy number must be at least 3 characters long')
];

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const validateComplaint = [
  body('policyNumber')
    .notEmpty()
    .withMessage('Policy number is required'),
  body('category')
    .isIn(['Claims', 'Policy Issues', 'Billing', 'Customer Service', 'Other'])
    .withMessage('Invalid category'),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High', 'Critical'])
    .withMessage('Invalid priority'),
  body('subject')
    .trim()
    .isLength({ min: 5 })
    .withMessage('Subject must be at least 5 characters long'),
  body('description')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters long')
];

const validateComment = [
  body('text')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Comment text is required')
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

export {
  validateRegistration,
  validateLogin,
  validateComplaint,
  validateComment,
  handleValidationErrors
};