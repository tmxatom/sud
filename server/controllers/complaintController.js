import { sendNotification } from '../config/firebase.js';
import Complaint from '../models/Complaint.js';
import User from '../models/User.js';
import generateComplaintId from '../utils/generateComplaintId.js';

const createComplaint = async (req, res) => {
  try {
    const { policyNumber, category, priority = 'Medium', subject, description } = req.body;
    const user = req.session.user;

    // Generate complaint ID
    const complaintId = await generateComplaintId();

    // Create complaint
    const complaint = new Complaint({
      complaintId,
      customerId: user.id,
      customerName: user.name,
      policyNumber,
      category,
      priority,
      subject,
      description,
      statusHistory: [{
        status: 'Submitted',
        changedByName: user.name,
        changedByRole: user.role,
        notes: 'Complaint submitted'
      }]
    });

    await complaint.save();

    res.status(201).json({
      message: 'Complaint created successfully',
      complaint
    });
  } catch (error) {
    console.error('Create complaint error:', error);
    res.status(500).json({ message: 'Server error creating complaint' });
  }
};

const getComplaints = async (req, res) => {
  try {
    const user = req.session.user;
    const {
      status,
      priority,
      category,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    let query = { isArchived: false };

    // Role-based filtering
    if (user.role === 'customer') {
      query.customerId = user.id;
    }

    // Apply filters
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { complaintId: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const complaints = await Complaint.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('customerId', 'name email');

    const total = await Complaint.countDocuments(query);

    res.json({
      complaints,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({ message: 'Server error fetching complaints' });
  }
};

const getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.session.user;

    const complaint = await Complaint.findById(id)
      .populate('customerId', 'name email phone')
      .populate('statusHistory.changedBy', 'name role')
      .populate('comments.userId', 'name role');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Check permissions
    if (user.role === 'customer' && complaint.customerId._id.toString() !== user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ complaint });
  } catch (error) {
    console.error('Get complaint error:', error);
    res.status(500).json({ message: 'Server error fetching complaint' });
  }
};

const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const user = req.session.user;

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Update status
    complaint.status = status;
    complaint.statusHistory.push({
      status,
      changedBy: user.id,
      changedByName: user.name,
      changedByRole: user.role,
      notes
    });
    complaint.updatedAt = new Date();

    await complaint.save();

    res.json({
      message: 'Status updated successfully',
      complaint
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Server error updating status' });
  }
};

const updateComplaintPriority = async (req, res) => {
  try {
    const { id } = req.params;
    const { priority } = req.body;
    const user = req.session.user;

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.priority = priority;
    complaint.updatedAt = new Date();

    await complaint.save();

    res.json({
      message: 'Priority updated successfully',
      complaint
    });
  } catch (error) {
    console.error('Update priority error:', error);
    res.status(500).json({ message: 'Server error updating priority' });
  }
};

const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const user = req.session.user;


   
  
    

    const complaint = await Complaint.findById(id);
    const owner = await User.findById(complaint.customerId)
    const notificatioToken = owner.notificationToken;
    console.log(owner);
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Check permissions for customers
    if (user.role === 'customer' && complaint.customerId.toString() !== user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    complaint.comments.push({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      text
    });
    complaint.updatedAt = new Date();

    await complaint.save();

    await sendNotification(notificatioToken ,complaint.complaintId);

    res.json({
      message: 'Comment added successfully',
      complaint
    });




  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error adding comment' });
  }
};

const archiveComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.isArchived = true;
    complaint.updatedAt = new Date();

    await complaint.save();

    res.json({
      message: 'Complaint archived successfully',
      complaint
    });
  } catch (error) {
    console.error('Archive complaint error:', error);
    res.status(500).json({ message: 'Server error archiving complaint' });
  }
};

const getComplaintStats = async (req, res) => {
  try {
    const user = req.session.user;
    let matchQuery = { isArchived: false };

    // Role-based filtering
    if (user.role === 'customer') {
      matchQuery.customerId = user.id;
    }

    const stats = await Complaint.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          submitted: {
            $sum: { $cond: [{ $eq: ['$status', 'Submitted'] }, 1, 0] }
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0] }
          },
          resolved: {
            $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] }
          },
          closed: {
            $sum: { $cond: [{ $eq: ['$status', 'Closed'] }, 1, 0] }
          },
          critical: {
            $sum: { $cond: [{ $eq: ['$priority', 'Critical'] }, 1, 0] }
          }
        }
      }
    ]);

    const result = stats[0] || {
      total: 0,
      submitted: 0,
      inProgress: 0,
      resolved: 0,
      closed: 0,
      critical: 0
    };

    res.json(result);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error fetching statistics' });
  }
};

export {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  updateComplaintPriority,
  addComment,
  archiveComplaint,
  getComplaintStats
};