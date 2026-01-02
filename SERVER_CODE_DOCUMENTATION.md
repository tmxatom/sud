# 📚 Server Code Documentation - SUD Life Insurance Complaint Tracking System

## 📋 Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Project Structure](#project-structure)
3. [Configuration Files](#configuration-files)
4. [Database Models](#database-models)
5. [Middleware](#middleware)
6. [Controllers](#controllers)
7. [Routes](#routes)
8. [Utilities](#utilities)
9. [API Flow](#api-flow)

---

## 🏗️ Architecture Overview

The server follows the **MVC (Model-View-Controller)** architecture pattern:

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│         Express Server              │
│  ┌───────────────────────────────┐  │
│  │     Middleware Layer          │  │
│  │  • CORS                       │  │
│  │  • Body Parser                │  │
│  │  • Session Management         │  │
│  │  • Authentication             │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │     Routes Layer              │  │
│  │  • /api/auth                  │  │
│  │  • /api/complaints            │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │     Controllers Layer         │  │
│  │  • authController             │  │
│  │  • complaintController        │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │     Models Layer              │  │
│  │  • User Model                 │  │
│  │  • Complaint Model            │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
       │
       ▼
┌─────────────┐
│  MongoDB    │
└─────────────┘
```

---

## 📁 Project Structure

```
server/
├── config/                    # Configuration files
│   ├── db.js                 # Database connection
│   ├── session.js            # Session configuration
│   └── firebase.js           # Firebase admin setup
│
├── controllers/               # Business logic
│   ├── authController.js     # Authentication logic
│   └── complaintController.js # Complaint management logic
│
├── middleware/                # Custom middleware
│   ├── auth.js               # Authentication & authorization
│   └── errorHandler.js       # Global error handling
│
├── models/                    # Database schemas
│   ├── User.js               # User model
│   └── Complaint.js          # Complaint model
│
├── routes/                    # API routes
│   ├── auth.js               # Auth routes
│   └── complaints.js         # Complaint routes
│
├── utils/                     # Utility functions
│   ├── validators.js         # Input validation
│   └── generateComplaintId.js # ID generation
│
├── .env                       # Environment variables
├── server.js                  # Main application entry
└── package.json              # Dependencies
```

---

## ⚙️ Configuration Files

### 1. **server.js** - Main Application Entry Point

**Purpose**: Initializes and configures the Express server

**Key Components**:

```javascript
// 1. Environment Setup
dotenv.config()  // Load environment variables

// 2. Database Connection
connectDB()      // Connect to MongoDB

// 3. Middleware Setup
app.use(cors())           // Cross-Origin Resource Sharing
app.use(express.json())   // Parse JSON bodies
app.use(session())        // Session management

// 4. Routes Registration
app.use('/api/auth', authRoutes)
app.use('/api/complaints', complaintRoutes)

// 5. Error Handling
app.use(errorHandler)     // Global error handler
```

**CORS Configuration**:
- Allows requests from: `localhost:3000`, `localhost:5173`, and production URL
- Enables credentials (cookies/sessions)
- Supports: GET, POST, PUT, DELETE methods

**Session Configuration**:
- Uses MongoDB to store sessions
- Enables session persistence across server restarts
- Configured for both development and production

---

### 2. **config/db.js** - Database Connection

**Purpose**: Establishes connection to MongoDB

```javascript
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);  // Exit if connection fails
  }
};
```

**Features**:
- Async/await for clean error handling
- Exits process if connection fails
- Logs connection status

---

### 3. **config/session.js** - Session Management

**Purpose**: Configures express-session with MongoDB store

**Key Settings**:

| Setting | Development | Production |
|---------|-------------|------------|
| `secure` | false | true (HTTPS only) |
| `sameSite` | 'lax' | 'none' (cross-origin) |
| `httpOnly` | false | false |
| `maxAge` | 1 day | 1 day |
| `proxy` | false | true |

**Session Store**:
- Uses `connect-mongo` to store sessions in MongoDB
- Collection name: `sessions`
- TTL (Time To Live): 24 hours

---

### 4. **config/firebase.js** - Push Notifications

**Purpose**: Firebase Admin SDK for sending push notifications

**Key Function**:

```javascript
export async function sendNotification(deviceToken, complaintId) {
  const message = {
    token: deviceToken,
    notification: {
      title: "New Update on Your Complaint",
      body: `An agent has responded to your complaint ${complaintId}`,
      image: 'https://dxwkpt4djlxwl.cloudfront.net/SUD_JV_Logo.svg'
    }
  };
  
  const response = await admin.messaging().send(message);
  return response;
}
```

**Usage**: Called when an agent adds a comment to a complaint

---

## 🗄️ Database Models

### 1. **User Model** (`models/User.js`)

**Schema Structure**:

```javascript
{
  name: String,              // User's full name
  email: String,             // Unique email (lowercase)
  password: String,          // Hashed password (bcrypt)
  role: String,              // 'customer' or 'agent'
  policyNumber: String,      // Required for customers
  phone: String,             // Contact number
  notificationToken: String, // Firebase FCM token
  createdAt: Date,
  updatedAt: Date
}
```

**Key Features**:

1. **Password Hashing** (Pre-save Hook):
```javascript
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
```

2. **Password Comparison** (Instance Method):
```javascript
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
```

**Security**:
- Passwords are never stored in plain text
- Uses bcrypt with salt rounds of 10
- Email is stored in lowercase for consistency

---

### 2. **Complaint Model** (`models/Complaint.js`)

**Schema Structure**:

```javascript
{
  complaintId: String,        // Auto-generated (COMP-YYYY-NNNN)
  customerId: ObjectId,       // Reference to User
  customerName: String,       // Denormalized for performance
  policyNumber: String,
  category: String,           // Claims, Policy Issues, etc.
  priority: String,           // Low, Medium, High, Critical
  status: String,             // Submitted, In Progress, Resolved, Closed
  subject: String,
  description: String,
  resolution: String,
  
  statusHistory: [{           // Track all status changes
    status: String,
    changedBy: ObjectId,
    changedByName: String,
    changedByRole: String,
    changedAt: Date,
    notes: String
  }],
  
  comments: [{                // Conversation thread
    userId: ObjectId,
    userName: String,
    userRole: String,
    text: String,
    createdAt: Date
  }],
  
  isArchived: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Enums**:
- **Category**: Claims, Policy Issues, Billing, Customer Service, Other
- **Priority**: Low, Medium, High, Critical
- **Status**: Submitted, In Progress, Resolved, Closed

**Design Decisions**:
- **Denormalization**: Stores `customerName` to avoid joins
- **Embedded Documents**: `statusHistory` and `comments` for better performance
- **Soft Delete**: Uses `isArchived` instead of deleting records

---

## 🔐 Middleware

### 1. **auth.js** - Authentication & Authorization

**Four Middleware Functions**:

#### a) `isAuthenticated`
```javascript
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  return res.status(401).json({ message: 'Not authenticated' });
};
```
**Purpose**: Ensures user is logged in

---

#### b) `isCustomer`
```javascript
const isCustomer = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'customer') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied. Customer role required.' });
};
```
**Purpose**: Restricts access to customers only

---

#### c) `isAgent`
```javascript
const isAgent = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'agent') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied. Agent role required.' });
};
```
**Purpose**: Restricts access to agents only

---

#### d) `isCustomerOrAgent`
```javascript
const isCustomerOrAgent = (req, res, next) => {
  if (req.session.user && 
      (req.session.user.role === 'customer' || req.session.user.role === 'agent')) {
    return next();
  }
  return res.status(403).json({ message: 'Access denied.' });
};
```
**Purpose**: Allows both customers and agents

---

### 2. **errorHandler.js** - Global Error Handling

**Handles Three Types of Errors**:

#### a) Mongoose Validation Errors
```javascript
if (err.name === 'ValidationError') {
  const errors = Object.values(err.errors).map(e => e.message);
  return res.status(400).json({
    message: 'Validation Error',
    errors
  });
}
```

#### b) Duplicate Key Errors
```javascript
if (err.code === 11000) {
  const field = Object.keys(err.keyValue)[0];
  return res.status(400).json({
    message: `${field} already exists`
  });
}
```

#### c) Generic Errors
```javascript
res.status(err.statusCode || 500).json({
  message: err.message || 'Internal Server Error'
});
```

---

## 🎮 Controllers

### 1. **authController.js** - Authentication Logic

#### **register** - User Registration

**Flow**:
```
1. Receive: name, email, password, phone, policyNumber, role
2. Check if email already exists
3. Create new user (password auto-hashed by pre-save hook)
4. Save user to database
5. Create session with user data
6. Return success response with user info
```

**Code**:
```javascript
const register = async (req, res) => {
  const { name, email, password, phone, policyNumber, role = 'customer' } = req.body;
  
  // Check existing user
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }
  
  // Create user
  const user = new User({ name, email, password, phone, role, policyNumber });
  await user.save();
  
  // Create session
  req.session.user = {
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
    policyNumber: user.policyNumber,
    notificationToken: user.notificationToken
  };
  
  res.status(201).json({ message: 'User registered successfully', user });
};
```

---

#### **login** - User Login

**Flow**:
```
1. Receive: email, password
2. Find user by email
3. Compare password using bcrypt
4. Create session
5. Save session explicitly (for reliability)
6. Return success with user data
```

**Code**:
```javascript
const login = async (req, res) => {
  const { email, password } = req.body;
  
  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  
  // Verify password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  
  // Create session
  req.session.user = {
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
    policyNumber: user.policyNumber,
    notificationToken: user.notificationToken
  };
  
  // Save session explicitly
  await new Promise((resolve, reject) => {
    req.session.save((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
  
  res.json({ message: 'Login successful', user, sessionId: req.sessionID });
};
```

**Security Note**: Returns generic "Invalid credentials" for both wrong email and wrong password to prevent user enumeration

---

#### **logout** - User Logout

**Flow**:
```
1. Destroy session
2. Clear session cookie
3. Return success message
```

**Code**:
```javascript
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Could not log out' });
    }
    res.clearCookie('sessionId');
    res.json({ message: 'Logout successful' });
  });
};
```

---

#### **checkSession** - Verify Authentication

**Purpose**: Check if user is authenticated (used on app load)

**Code**:
```javascript
const checkSession = (req, res) => {
  if (req.session && req.session.user) {
    res.json({
      authenticated: true,
      user: req.session.user
    });
  } else {
    res.json({
      authenticated: false,
      user: null
    });
  }
};
```

---

#### **updateNotificationToken** - Update FCM Token

**Purpose**: Store Firebase Cloud Messaging token for push notifications

**Code**:
```javascript
const updateNotificationToken = async (req, res) => {
  const { token } = req.body;
  const user = req.session.user;
  
  // Update in database
  const updatedUser = await User.findByIdAndUpdate(
    user.id,
    { notificationToken: token },
    { new: true }
  );
  
  // Update in session
  req.session.user.notificationToken = token;
  
  res.json({ message: 'Notification token updated successfully', token });
};
```

---

### 2. **complaintController.js** - Complaint Management

#### **createComplaint** - Create New Complaint

**Flow**:
```
1. Receive: policyNumber, category, priority, subject, description
2. Generate unique complaint ID (COMP-2026-0001)
3. Create complaint with initial status "Submitted"
4. Add initial status history entry
5. Save to database
6. Return created complaint
```

**Code**:
```javascript
const createComplaint = async (req, res) => {
  const { policyNumber, category, priority = 'Medium', subject, description } = req.body;
  const user = req.session.user;
  
  // Generate ID
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
  
  res.status(201).json({ message: 'Complaint created successfully', complaint });
};
```

---

#### **getComplaints** - Fetch Complaints (Role-Based)

**Features**:
- **Role-based filtering**: Customers see only their complaints, agents see all
- **Search**: By subject, description, or complaint ID
- **Filters**: By status, priority, category
- **Sorting**: By any field, ascending or descending
- **Excludes archived complaints**

**Code**:
```javascript
const getComplaints = async (req, res) => {
  const user = req.session.user;
  const { status, priority, category, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
  
  let query = { isArchived: false };
  
  // Role-based filtering
  if (user.role === 'customer') {
    query.customerId = user.id;
  }
  
  // Apply filters
  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (category) query.category = category;
  
  // Search
  if (search) {
    query.$or = [
      { subject: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { complaintId: { $regex: search, $options: 'i' } }
    ];
  }
  
  // Sort
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
  
  // Execute query
  const complaints = await Complaint.find(query)
    .sort(sortOptions)
    .populate('customerId', 'name email');
  
  res.json({ complaints, total: complaints.length });
};
```

---

#### **getComplaintById** - Get Single Complaint

**Features**:
- Populates customer details
- Populates status history with user info
- Populates comments with user info
- **Access Control**: Customers can only view their own complaints

**Code**:
```javascript
const getComplaintById = async (req, res) => {
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
};
```

---

#### **updateComplaintStatus** - Update Status (Agent Only)

**Features**:
- Updates complaint status
- Adds entry to status history
- Records who made the change and when
- Allows optional notes

**Code**:
```javascript
const updateComplaintStatus = async (req, res) => {
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
  
  res.json({ message: 'Status updated successfully', complaint });
};
```

---

#### **updateComplaintPriority** - Update Priority (Agent Only)

**Code**:
```javascript
const updateComplaintPriority = async (req, res) => {
  const { id } = req.params;
  const { priority } = req.body;
  
  const complaint = await Complaint.findById(id);
  if (!complaint) {
    return res.status(404).json({ message: 'Complaint not found' });
  }
  
  complaint.priority = priority;
  complaint.updatedAt = new Date();
  
  await complaint.save();
  
  res.json({ message: 'Priority updated successfully', complaint });
};
```

---

#### **addComment** - Add Comment to Complaint

**Features**:
- Both customers and agents can comment
- Customers can only comment on their own complaints
- **Sends push notification** to complaint owner when agent comments

**Code**:
```javascript
const addComment = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const user = req.session.user;
  
  const complaint = await Complaint.findById(id);
  const owner = await User.findById(complaint.customerId);
  const notificationToken = owner.notificationToken;
  
  if (!complaint) {
    return res.status(404).json({ message: 'Complaint not found' });
  }
  
  // Check permissions
  if (user.role === 'customer' && complaint.customerId.toString() !== user.id) {
    return res.status(403).json({ message: 'Access denied' });
  }
  
  // Add comment
  complaint.comments.push({
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    text
  });
  complaint.updatedAt = new Date();
  
  await complaint.save();
  
  // Send notification
  await sendNotification(notificationToken, complaint.complaintId);
  
  res.json({ message: 'Comment added successfully', complaint });
};
```

---

#### **archiveComplaint** - Archive Complaint (Agent Only)

**Purpose**: Soft delete - hides complaint from normal views but keeps data

**Code**:
```javascript
const archiveComplaint = async (req, res) => {
  const { id } = req.params;
  
  const complaint = await Complaint.findById(id);
  if (!complaint) {
    return res.status(404).json({ message: 'Complaint not found' });
  }
  
  complaint.isArchived = true;
  complaint.updatedAt = new Date();
  
  await complaint.save();
  
  res.json({ message: 'Complaint archived successfully', complaint });
};
```

---

#### **getComplaintStats** - Get Statistics

**Features**:
- Aggregates complaint counts by status
- Counts critical priority complaints
- Role-based: Customers see their stats, agents see all

**Code**:
```javascript
const getComplaintStats = async (req, res) => {
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
        submitted: { $sum: { $cond: [{ $eq: ['$status', 'Submitted'] }, 1, 0] } },
        inProgress: { $sum: { $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0] } },
        resolved: { $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] } },
        closed: { $sum: { $cond: [{ $eq: ['$status', 'Closed'] }, 1, 0] } },
        critical: { $sum: { $cond: [{ $eq: ['$priority', 'Critical'] }, 1, 0] } }
      }
    }
  ]);
  
  const result = stats[0] || {
    total: 0, submitted: 0, inProgress: 0, resolved: 0, closed: 0, critical: 0
  };
  
  res.json(result);
};
```

---

## 🛣️ Routes

### 1. **auth.js** - Authentication Routes

```javascript
// Public Routes
POST   /api/auth/register          // Register new user
POST   /api/auth/login             // Login user
GET    /api/auth/check-session     // Check authentication status

// Protected Routes (require authentication)
POST   /api/auth/logout            // Logout user
GET    /api/auth/me                // Get current user
PUT    /api/auth/notification-token // Update FCM token
```

**Middleware Chain Example**:
```javascript
router.post('/register', 
  validateRegistration,      // Validate input
  handleValidationErrors,    // Check for errors
  register                   // Execute controller
);
```

---

### 2. **complaints.js** - Complaint Routes

```javascript
// Protected Routes (all require authentication)
GET    /api/complaints/stats       // Get statistics
GET    /api/complaints             // Get all complaints (role-based)
POST   /api/complaints             // Create complaint (customer only)
GET    /api/complaints/:id         // Get single complaint
PUT    /api/complaints/:id/status  // Update status (agent only)
PUT    /api/complaints/:id/priority // Update priority (agent only)
POST   /api/complaints/:id/comments // Add comment
PUT    /api/complaints/:id/archive  // Archive complaint (agent only)
```

**Middleware Chain Example**:
```javascript
router.post('/', 
  isAuthenticated,           // Check if logged in
  isCustomer,                // Check if customer
  validateComplaint,         // Validate input
  handleValidationErrors,    // Check for errors
  createComplaint            // Execute controller
);
```

---

## 🔧 Utilities

### 1. **validators.js** - Input Validation

Uses `express-validator` for server-side validation

**Registration Validation**:
```javascript
const validateRegistration = [
  body('name').trim().isLength({ min: 2 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('phone').isMobilePhone(),
  body('policyNumber').optional().isLength({ min: 3 })
];
```

**Login Validation**:
```javascript
const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];
```

**Complaint Validation**:
```javascript
const validateComplaint = [
  body('policyNumber').notEmpty(),
  body('category').isIn(['Claims', 'Policy Issues', 'Billing', 'Customer Service', 'Other']),
  body('priority').optional().isIn(['Low', 'Medium', 'High', 'Critical']),
  body('subject').trim().isLength({ min: 5 }),
  body('description').trim().isLength({ min: 10 })
];
```

---

### 2. **generateComplaintId.js** - ID Generation

**Purpose**: Generate unique complaint IDs in format `COMP-YYYY-NNNN`

**Algorithm**:
```
1. Get current year
2. Find latest complaint for this year
3. Extract number from last complaint ID
4. Increment by 1
5. Pad with zeros to 4 digits
6. Return formatted ID
```

**Code**:
```javascript
const generateComplaintId = async () => {
  const currentYear = new Date().getFullYear();
  const prefix = `COMP-${currentYear}-`;
  
  // Find latest complaint for this year
  const latestComplaint = await Complaint.findOne({
    complaintId: { $regex: `^${prefix}` }
  }).sort({ complaintId: -1 });
  
  let nextNumber = 1;
  if (latestComplaint) {
    const lastNumber = parseInt(latestComplaint.complaintId.split('-')[2]);
    nextNumber = lastNumber + 1;
  }
  
  // Pad with zeros (0001, 0002, etc.)
  const paddedNumber = nextNumber.toString().padStart(4, '0');
  return `${prefix}${paddedNumber}`;
};
```

**Examples**:
- First complaint of 2026: `COMP-2026-0001`
- 100th complaint of 2026: `COMP-2026-0100`
- 1000th complaint of 2026: `COMP-2026-1000`

---

## 🔄 API Flow Examples

### Example 1: User Registration Flow

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ POST /api/auth/register
       │ { name, email, password, phone, policyNumber }
       ▼
┌─────────────────────────────┐
│  validateRegistration       │ ← Validate input
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  handleValidationErrors     │ ← Check for errors
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  authController.register    │
│  1. Check if user exists    │
│  2. Create user             │
│  3. Hash password (auto)    │
│  4. Save to database        │
│  5. Create session          │
│  6. Return user data        │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────┐
│   Client    │ ← { message, user }
└─────────────┘
```

---

### Example 2: Create Complaint Flow

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ POST /api/complaints
       │ { policyNumber, category, priority, subject, description }
       ▼
┌─────────────────────────────┐
│  isAuthenticated            │ ← Check session
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  isCustomer                 │ ← Check role
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  validateComplaint          │ ← Validate input
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  handleValidationErrors     │ ← Check for errors
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  complaintController.create     │
│  1. Generate complaint ID       │
│  2. Create complaint object     │
│  3. Add initial status history  │
│  4. Save to database            │
│  5. Return complaint            │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────┐
│   Client    │ ← { message, complaint }
└─────────────┘
```

---

### Example 3: Add Comment with Notification Flow

```
┌─────────────┐
│   Client    │ (Agent)
└──────┬──────┘
       │ POST /api/complaints/:id/comments
       │ { text: "We are reviewing your case" }
       ▼
┌─────────────────────────────┐
│  isAuthenticated            │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  validateComment            │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  complaintController.addComment     │
│  1. Find complaint                  │
│  2. Get complaint owner             │
│  3. Check permissions               │
│  4. Add comment to complaint        │
│  5. Save complaint                  │
│  6. Send push notification          │ ──┐
│  7. Return updated complaint        │   │
└──────┬──────────────────────────────┘   │
       │                                   │
       ▼                                   │
┌─────────────┐                            │
│   Client    │ ← { message, complaint }   │
└─────────────┘                            │
                                           │
                                           ▼
                                    ┌──────────────┐
                                    │   Firebase   │
                                    │   Sends      │
                                    │   Push       │
                                    │   Notification│
                                    └──────┬───────┘
                                           │
                                           ▼
                                    ┌──────────────┐
                                    │  Customer's  │
                                    │   Device     │
                                    └──────────────┘
```

---

## 🔐 Security Features

### 1. **Password Security**
- ✅ Bcrypt hashing with salt
- ✅ Never store plain text passwords
- ✅ Generic error messages (prevent user enumeration)

### 2. **Session Security**
- ✅ Session stored in MongoDB (not in memory)
- ✅ HttpOnly cookies (prevent XSS)
- ✅ Secure cookies in production (HTTPS only)
- ✅ SameSite protection
- ✅ Session expiration (24 hours)

### 3. **Authorization**
- ✅ Role-based access control (RBAC)
- ✅ Middleware chain for route protection
- ✅ Resource-level permissions (customers can only access their own data)

### 4. **Input Validation**
- ✅ Server-side validation with express-validator
- ✅ Sanitization (trim, normalize)
- ✅ Type checking
- ✅ Enum validation

### 5. **CORS Protection**
- ✅ Whitelist allowed origins
- ✅ Credentials support
- ✅ Method restrictions

### 6. **Error Handling**
- ✅ Global error handler
- ✅ No sensitive data in error messages
- ✅ Proper HTTP status codes

---

## 📊 Database Indexes (Recommended)

For better performance, add these indexes:

```javascript
// User Model
userSchema.index({ email: 1 });  // Unique index already exists

// Complaint Model
complaintSchema.index({ complaintId: 1 });  // Unique index
complaintSchema.index({ customerId: 1 });   // For customer queries
complaintSchema.index({ status: 1 });       // For filtering
complaintSchema.index({ priority: 1 });     // For filtering
complaintSchema.index({ createdAt: -1 });   // For sorting
complaintSchema.index({ isArchived: 1 });   // For filtering
```

---

## 🚀 Performance Optimizations

### 1. **Denormalization**
- Store `customerName` in complaints to avoid joins
- Store `userName` and `userRole` in comments

### 2. **Pagination** (Currently Disabled)
- Can be re-enabled by adding `skip()` and `limit()` to queries

### 3. **Selective Population**
- Only populate required fields: `.populate('customerId', 'name email')`

### 4. **Aggregation Pipeline**
- Used for statistics to calculate on database side

---

## 🧪 Testing Recommendations

### 1. **Unit Tests**
- Test individual controller functions
- Mock database calls
- Test validation logic

### 2. **Integration Tests**
- Test complete API flows
- Use test database
- Test authentication and authorization

### 3. **Security Tests**
- Test unauthorized access attempts
- Test SQL injection prevention
- Test XSS prevention

---

## 📝 Environment Variables

Required in `.env` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/complaint-tracking

# Session
SESSION_SECRET=your-super-secret-key-here

# Client
CLIENT_URL=http://localhost:5173

# Firebase (for push notifications)
FIREBASE_CREDS={"type":"service_account",...}
```

---

## 🎯 Key Takeaways

1. **MVC Architecture**: Clean separation of concerns
2. **Session-Based Auth**: Secure, stateful authentication
3. **Role-Based Access**: Customers and agents have different permissions
4. **Audit Trail**: Status history tracks all changes
5. **Real-Time Notifications**: Firebase push notifications
6. **Soft Deletes**: Archive instead of delete for data retention
7. **Input Validation**: Both client and server-side validation
8. **Error Handling**: Centralized error handling middleware

---

## 📚 Dependencies

```json
{
  "bcryptjs": "Password hashing",
  "connect-mongo": "MongoDB session store",
  "cors": "Cross-origin resource sharing",
  "dotenv": "Environment variables",
  "express": "Web framework",
  "express-session": "Session management",
  "express-validator": "Input validation",
  "firebase-admin": "Push notifications",
  "mongoose": "MongoDB ODM"
}
```

---

**Last Updated**: January 2, 2026  
**Version**: 1.0.0  
**Author**: SUD Life Insurance Development Team
