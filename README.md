# Complaint/Issue Tracking System - SUD Life Insurance

A full-stack MERN application for managing customer complaints and issues for SUD Life Insurance company.

## 🚀 Features

### Authentication & Authorization
- Session-based authentication using express-session
- Role-based access control (Customer & Agent)
- Secure password hashing with bcrypt
- Session persistence across page refreshes

### Customer Features
- Register and login to personal dashboard
- Create new complaints with detailed information
- View and track own complaints
- Add comments to complaints
- Search and filter complaints
- Real-time status updates

### Agent Features
- View all customer complaints
- Update complaint status and priority
- Add resolution notes and comments
- Archive/unarchive complaints
- Advanced search and filtering
- Dashboard with statistics

### Core Functionality
- CRUD operations for complaints
- Auto-generated complaint IDs (COMP-YYYY-NNNN)
- Status tracking with history
- Priority management
- Category-based organization
- Comment system
- Responsive design

## 🛠 Tech Stack

- **Frontend**: React.js, Tailwind CSS, React Router, Axios
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: Express-session with MongoDB store
- **Icons**: React Icons (Feather Icons)

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🔧 Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd complaint-tracking-system
```

### 2. Install dependencies
```bash
# Install root dependencies
npm install

# Install server dependencies
npm run install-server

# Install client dependencies
npm run install-client
```

### 3. Environment Configuration

Create `.env` file in the server directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/complaint-tracking
SESSION_SECRET=mysupersecretkey123456789
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### 4. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### 5. Seed the database (Optional)
```bash
cd server
npm run seed
```

### 6. Start the application
```bash
# Start both frontend and backend
npm run dev

# Or start individually:
# Backend (from server directory)
npm run dev

# Frontend (from client directory)
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 👥 Demo Accounts

After seeding the database, you can use these accounts:

### Customer Accounts
- **Email**: rajesh@test.com | **Password**: customer123
- **Email**: priya@test.com | **Password**: customer123

### Agent Account
- **Email**: agent@sud.com | **Password**: agent123

## 📱 Usage

### For Customers
1. Register with your policy details or login with existing account
2. Access your dashboard to view complaint statistics
3. Create new complaints with detailed information
4. Track complaint status and add comments
5. Search and filter your complaints

### For Agents
1. Login with agent credentials
2. View dashboard with overall statistics
3. Access all customer complaints
4. Update complaint status and priority
5. Add resolution notes and comments
6. Archive resolved complaints

## 🗂 Project Structure

```
complaint-tracking-system/
├── client/                     # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/          # Authentication components
│   │   │   ├── customer/      # Customer-specific components
│   │   │   ├── agent/         # Agent-specific components
│   │   │   └── shared/        # Shared components
│   │   ├── context/           # React context
│   │   ├── services/          # API services
│   │   ├── utils/             # Utility functions
│   │   └── App.jsx
│   └── package.json
├── server/                     # Node.js backend
│   ├── config/                # Database and session config
│   ├── controllers/           # Route controllers
│   ├── middleware/            # Custom middleware
│   ├── models/                # Mongoose models
│   ├── routes/                # API routes
│   ├── utils/                 # Utility functions
│   └── server.js
└── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new customer
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/check-session` - Check authentication status

### Complaints
- `GET /api/complaints` - Get complaints (role-based)
- `POST /api/complaints` - Create new complaint (customer only)
- `GET /api/complaints/:id` - Get single complaint
- `PUT /api/complaints/:id/status` - Update status (agent only)
- `PUT /api/complaints/:id/priority` - Update priority (agent only)
- `POST /api/complaints/:id/comments` - Add comment
- `PUT /api/complaints/:id/archive` - Archive complaint (agent only)
- `GET /api/complaints/stats` - Get complaint statistics

## 🎨 UI Components

### Status Badges
- **Submitted**: Blue badge
- **In Progress**: Yellow badge
- **Resolved**: Green badge
- **Closed**: Gray badge

### Priority Indicators
- **Low**: Green indicator
- **Medium**: Yellow indicator
- **High**: Orange indicator
- **Critical**: Red indicator

## 🔒 Security Features

- Password hashing with bcrypt
- Session-based authentication
- Role-based access control
- Input validation and sanitization
- CORS protection
- Secure session configuration

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
MONGO_URI=<your-mongodb-connection-string>
SESSION_SECRET=<your-secure-session-secret>
CLIENT_URL=<your-frontend-url>
```

### Build for Production
```bash
# Build frontend
cd client
npm run build

# The build folder can be served by your backend or a static server
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**SUD Life Insurance** - Committed to resolving your concerns with transparency and efficiency.