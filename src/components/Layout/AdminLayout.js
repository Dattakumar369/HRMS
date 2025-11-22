import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import AdminDashboard from '../Admin/Dashboard/Dashboard';
import EmployeeManagement from '../Admin/EmployeeManagement/EmployeeManagement';
import TeamsDepartments from '../Admin/TeamsDepartments/TeamsDepartments';
import AttendanceManagement from '../Admin/Attendance/AttendanceManagement';
import TimesheetsAdmin from '../Admin/Timesheets/TimesheetsAdmin';
import LeaveManagementAdmin from '../Admin/Leave/LeaveManagementAdmin';
import PayrollManagement from '../Admin/Payroll/PayrollManagement';
import AnnouncementsAdmin from '../Admin/Announcements/AnnouncementsAdmin';
import PerformanceManagement from '../Admin/Performance/PerformanceManagement';
import Settings from '../Admin/Settings/Settings';
import './Layout.css';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="layout">
      <Sidebar role="Admin" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className={`layout-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Header onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <div className="main-content">
          <Routes>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="employees" element={<EmployeeManagement />} />
            <Route path="teams-departments" element={<TeamsDepartments />} />
            <Route path="attendance" element={<AttendanceManagement />} />
            <Route path="timesheets" element={<TimesheetsAdmin />} />
            <Route path="leaves" element={<LeaveManagementAdmin />} />
            <Route path="payroll" element={<PayrollManagement />} />
            <Route path="announcements" element={<AnnouncementsAdmin />} />
            <Route path="performance" element={<PerformanceManagement />} />
            <Route path="settings" element={<Settings />} />
            <Route path="" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

