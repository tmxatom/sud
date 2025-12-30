import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/shared/Navbar';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import CustomerDashboard from './components/customer/CustomerDashboard';
import CreateComplaint from './components/customer/CreateComplaint';
import CustomerComplaintDetails from './components/customer/ComplaintDetails';
import AgentDashboard from './components/agent/AgentDashboard';
import ComplaintDetails from './components/agent/ComplaintDetails';
import { generateToken, messaging } from './notifications/firebase';
import { onMessage } from 'firebase/messaging';
import showToast from './utils/toast';

function App() {
   
  useEffect(() => {
    generateToken();
    
    onMessage(messaging, (payload) => {
      console.log('Notification received:', payload);
      
      const { notification } = payload;
      
      if (notification) {
        // Simple toast notification
        showToast(`${notification.title} : ${notification.body}`, 'info');
      }
    });
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          
          {/* Simple Toaster - one configuration */}
          <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            containerStyle={{
              top: 80,
            }}
          />
          
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route 
              path="/customer/dashboard" 
              element={
                <ProtectedRoute requiredRole="customer">
                  <CustomerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/customer/create-complaint" 
              element={
                <ProtectedRoute requiredRole="customer">
                  <CreateComplaint />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/complaint/:id" 
              element={
                <ProtectedRoute requiredRole="customer">
                  <CustomerComplaintDetails />
                </ProtectedRoute>
              } 
            />
            
            {/* Agent Routes */}
            <Route 
              path="/agent/dashboard" 
              element={
                <ProtectedRoute requiredRole="agent">
                  <AgentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/agent/complaint/:id" 
              element={
                <ProtectedRoute requiredRole="agent">
                  <ComplaintDetails />
                </ProtectedRoute>
              } 
            />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;