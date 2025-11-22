import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { initializeDemoData } from './utils/dataInitializer';
import Login from './components/Auth/Login';
import AdminLayout from './components/Layout/AdminLayout';
import EmployeeLayout from './components/Layout/EmployeeLayout';
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  useEffect(() => {
    // Initialize demo data on app load
    initializeDemoData();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute role="Admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/*"
          element={
            <ProtectedRoute role="Employee">
              <EmployeeLayout />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

