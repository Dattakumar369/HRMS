import React from 'react';
import { NavLink } from 'react-router-dom';
import { logout } from '../../utils/dataInitializer';
import { useNavigate } from 'react-router-dom';
import { 
  FaChartLine, FaUsers, FaBuilding, FaCalendarAlt, FaClock, 
  FaUmbrellaBeach, FaDollarSign, FaBullhorn, FaStar, FaCog,
  FaUser, FaFileAlt, FaSignOutAlt
} from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ role, isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminMenuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: FaChartLine },
    { path: '/admin/employees', label: 'Employees', icon: FaUsers },
    { path: '/admin/teams-departments', label: 'Teams & Departments', icon: FaBuilding },
    { path: '/admin/attendance', label: 'Attendance', icon: FaCalendarAlt },
    { path: '/admin/timesheets', label: 'Timesheets', icon: FaClock },
    { path: '/admin/leaves', label: 'Leave Management', icon: FaUmbrellaBeach },
    { path: '/admin/payroll', label: 'Payroll', icon: FaDollarSign },
    { path: '/admin/announcements', label: 'Announcements', icon: FaBullhorn },
    { path: '/admin/performance', label: 'Performance', icon: FaStar },
    { path: '/admin/settings', label: 'Settings', icon: FaCog }
  ];

  const employeeMenuItems = [
    { path: '/employee/dashboard', label: 'Dashboard', icon: FaChartLine },
    { path: '/employee/profile', label: 'Profile', icon: FaUser },
    { path: '/employee/attendance', label: 'Attendance', icon: FaCalendarAlt },
    { path: '/employee/timesheets', label: 'Timesheets', icon: FaClock },
    { path: '/employee/leaves', label: 'Leaves', icon: FaUmbrellaBeach },
    { path: '/employee/payslips', label: 'Payslips', icon: FaDollarSign },
    { path: '/employee/documents', label: 'Documents', icon: FaFileAlt },
    { path: '/employee/announcements', label: 'Announcements', icon: FaBullhorn },
    { path: '/employee/teams', label: 'Teams', icon: FaUsers }
  ];

  const menuItems = role === 'Admin' ? adminMenuItems : employeeMenuItems;

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>EMS</h2>
          <button className="sidebar-close-btn" onClick={onClose}>×</button>
        </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <span className="nav-icon"><item.icon /></span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-button">
          <span className="nav-icon"><FaSignOutAlt /></span>
          <span className="nav-label">Logout</span>
        </button>
      </div>
      </div>
    </>
  );
};

export default Sidebar;

