import React, { useState, useEffect } from 'react';
import { getCurrentUser, getStorageData } from '../../utils/dataInitializer';
import { getSmallAvatar, getInitials } from '../../utils/avatarHelper';
import { FaBars } from 'react-icons/fa';
import './Header.css';

const Header = ({ onMenuClick, isSidebarOpen }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    
    if (user) {
      const employees = getStorageData('ems_employees');
      const emp = employees.find(e => e.id === user.id || e.email === user.email);
      setEmployee(emp);
    }
  }, []);

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <button className="menu-toggle-btn" onClick={onMenuClick} aria-label="Toggle menu">
            <FaBars className="hamburger-icon" />
          </button>
          <h1 className="page-title">Employee Management System</h1>
        </div>
        <div className="header-right">
          <div className="user-info">
            <span className="user-name">{currentUser?.name || 'User'}</span>
            <div className="user-avatar">
              {employee && !imageError ? (
                <img
                  src={getSmallAvatar(employee)}
                  alt={currentUser?.name}
                  className="user-avatar-image"
                  onError={() => setImageError(true)}
                />
              ) : (
                <span>{getInitials(currentUser?.name || 'U')}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

