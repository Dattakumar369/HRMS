import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import EmployeeDashboard from '../Employee/Dashboard/Dashboard';
import Profile from '../Employee/Profile/Profile';
import AttendanceEmployee from '../Employee/Attendance/AttendanceEmployee';
import TimesheetsEmployee from '../Employee/Timesheets/TimesheetsEmployee';
import LeaveEmployee from '../Employee/Leave/LeaveEmployee';
import Payslips from '../Employee/Payslips/Payslips';
import Documents from '../Employee/Documents/Documents';
import AnnouncementsEmployee from '../Employee/Announcements/AnnouncementsEmployee';
import TeamsOrg from '../Employee/TeamsOrg/TeamsOrg';
import './Layout.css';

const EmployeeLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="layout">
      <Sidebar role="Employee" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className={`layout-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Header onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <div className="main-content">
          <Routes>
            <Route path="dashboard" element={<EmployeeDashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="attendance" element={<AttendanceEmployee />} />
            <Route path="timesheets" element={<TimesheetsEmployee />} />
            <Route path="leaves" element={<LeaveEmployee />} />
            <Route path="payslips" element={<Payslips />} />
            <Route path="documents" element={<Documents />} />
            <Route path="announcements" element={<AnnouncementsEmployee />} />
            <Route path="teams" element={<TeamsOrg />} />
            <Route path="" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLayout;

