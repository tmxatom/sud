import express from 'express';
const router = express.Router();
import {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  updateComplaintPriority,
  addComment,
  archiveComplaint,
  getComplaintStats
} from '../controllers/complaintController.js';
import {
  validateComplaint,
  validateComment,
  handleValidationErrors
} from '../utils/validators.js';
import {
  isAuthenticated,
  isCustomer,
  isAgent,
  isCustomerOrAgent
} from '../middleware/auth.js';

// @route   GET /api/complaints/stats
// @desc    Get complaint statistics
// @access  Private
router.get('/stats', isAuthenticated, getComplaintStats);

// @route   GET /api/complaints
// @desc    Get complaints (role-based)
// @access  Private
router.get('/', isAuthenticated, getComplaints);

// @route   POST /api/complaints
// @desc    Create new complaint
// @access  Private (Customer only)
router.post('/', isAuthenticated, isCustomer, validateComplaint, handleValidationErrors, createComplaint);

// @route   GET /api/complaints/:id
// @desc    Get single complaint
// @access  Private
router.get('/:id', isAuthenticated, getComplaintById);

// @route   PUT /api/complaints/:id/status
// @desc    Update complaint status
// @access  Private (Agent only)
router.put('/:id/status', isAuthenticated, isAgent, updateComplaintStatus);

// @route   PUT /api/complaints/:id/priority
// @desc    Update complaint priority
// @access  Private (Agent only)
router.put('/:id/priority', isAuthenticated, isAgent, updateComplaintPriority);

// @route   POST /api/complaints/:id/comments
// @desc    Add comment to complaint
// @access  Private
router.post('/:id/comments', isAuthenticated, validateComment, handleValidationErrors, addComment);

// @route   PUT /api/complaints/:id/archive
// @desc    Archive complaint
// @access  Private (Agent only)
router.put('/:id/archive', isAuthenticated, isAgent, archiveComplaint);

export default router;