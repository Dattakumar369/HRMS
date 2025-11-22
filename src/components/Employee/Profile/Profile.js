import React, { useState, useEffect } from 'react';
import { getStorageData, getCurrentUser, setStorageData } from '../../../utils/dataInitializer';
import { getEmployeeAvatar, getInitials } from '../../../utils/avatarHelper';
import { 
  FaCamera, FaUser, FaBriefcase, FaDollarSign, FaClock, 
  FaStar, FaExclamationTriangle, FaEdit, FaSync
} from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
  const [employee, setEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      const employees = getStorageData('ems_employees');
      const emp = employees.find(e => e.id === currentUser.id || e.email === currentUser.email);
      setEmployee(emp);
      setFormData(emp || {});
    }
  }, []);

  const handleSave = () => {
    const employees = getStorageData('ems_employees');
    const updated = employees.map(e =>
      e.id === employee.id ? { ...employee, ...formData } : e
    );
    setStorageData('ems_employees', updated);
    setEmployee({ ...employee, ...formData });
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result;
        const updatedFormData = { ...formData, profileImage: imageUrl };
        setFormData(updatedFormData);
        const employees = getStorageData('ems_employees');
        const updated = employees.map(e =>
          e.id === employee.id ? { ...employee, profileImage: imageUrl } : e
        );
        setStorageData('ems_employees', updated);
        setEmployee({ ...employee, profileImage: imageUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!employee) {
    return <div>Loading...</div>;
  }

  return (
    <div className="employee-profile-page">
      <div className="profile-sidebar">
        <div className="profile-header-section">
          <div className="profile-image-container">
            <div className="profile-background"></div>
            <div className="profile-avatar-wrapper">
              {!imageError ? (
                <img
                  src={getEmployeeAvatar(employee)}
                  alt={employee.name}
                  className="profile-avatar-image"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="profile-avatar-fallback">
                  {getInitials(employee.name)}
                </div>
              )}
              <label className="avatar-upload-label" title="Change Profile Picture">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <FaCamera className="avatar-upload-icon" />
              </label>
            </div>
            <button className="btn-all-actions">All Actions</button>
          </div>
          
          <div className="profile-status">
            <FaUser className="status-icon" />
            <span className="status-text">{employee.status || 'Active'}</span>
          </div>

          <div className="profile-name-section">
            <h2 className="employee-name">{employee.name}</h2>
            <p className="employee-title">{employee.designation}</p>
            <p className="employee-department">{employee.department}</p>
            {employee.employeeId && (
              <p className="employee-id">ID: {employee.employeeId}</p>
            )}
          </div>
        </div>

        <nav className="profile-nav">
          <button
            className={`nav-item ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            <FaUser className="nav-icon" />
            <span className="nav-label">Personal Data</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'job' ? 'active' : ''}`}
            onClick={() => setActiveTab('job')}
          >
            <FaBriefcase className="nav-icon" />
            <span className="nav-label">Job Data</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'compensation' ? 'active' : ''}`}
            onClick={() => setActiveTab('compensation')}
          >
            <FaDollarSign className="nav-icon" />
            <span className="nav-label">Compensation</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'time' ? 'active' : ''}`}
            onClick={() => setActiveTab('time')}
          >
            <FaClock className="nav-icon" />
            <span className="nav-label">Time Management</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'performance' ? 'active' : ''}`}
            onClick={() => setActiveTab('performance')}
          >
            <FaStar className="nav-icon" />
            <span className="nav-label">Performance and Goals</span>
          </button>
        </nav>
      </div>

      <div className="profile-main-content">
        <div className="content-header">
          <h1 className="section-title">
            {activeTab === 'personal' && 'Personal Data'}
            {activeTab === 'job' && 'Job Data'}
            {activeTab === 'compensation' && 'Compensation'}
            {activeTab === 'time' && 'Time Management'}
            {activeTab === 'performance' && 'Performance and Goals'}
          </h1>
        </div>

        {activeTab === 'personal' && (
          <div className="profile-sections">
            <div className="info-card">
              <div className="card-header">
                <h3>Personal Information</h3>
                <div className="card-actions">
                  <button className="action-icon" title="Warning"><FaExclamationTriangle /></button>
                  <button className="action-icon" onClick={() => setIsEditing(!isEditing)} title="Edit"><FaEdit /></button>
                  <button className="action-icon" title="Refresh"><FaSync /></button>
                </div>
              </div>
              <div className="card-content">
                <div className="info-row">
                  <span className="info-label">First Name:</span>
                  <span className="info-value">{employee.name?.split(' ')[0] || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Last Name:</span>
                  <span className="info-value">{employee.name?.split(' ').slice(1).join(' ') || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{employee.email || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Contact No:</span>
                  <span className="info-value">
                    {isEditing ? (
                      <input
                        type="tel"
                        value={formData.contactNo || ''}
                        onChange={(e) => setFormData({ ...formData, contactNo: e.target.value })}
                        className="inline-input"
                      />
                    ) : (
                      employee.contactNo || 'N/A'
                    )}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Gender:</span>
                  <span className="info-value">{employee.gender || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Work Location:</span>
                  <span className="info-value">{employee.workLocation || 'N/A'}</span>
                </div>
                <a href="#" className="view-all-link">View All</a>
              </div>
            </div>

            <div className="info-card">
              <div className="card-header">
                <h3>Biographical Information</h3>
                <div className="card-actions">
                  <button className="action-icon" title="Warning">⚠️</button>
                  <button className="action-icon" title="Edit">✏️</button>
                  <button className="action-icon" title="Refresh">🔄</button>
                </div>
              </div>
              <div className="card-content">
                <div className="info-row">
                  <span className="info-label">Employee ID:</span>
                  <span className="info-value">{employee.employeeId || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Date of Birth:</span>
                  <span className="info-value">N/A</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Country of Birth:</span>
                  <span className="info-value">N/A</span>
                </div>
                <a href="#" className="view-all-link">View All</a>
              </div>
            </div>

            <div className="info-card">
              <div className="card-header">
                <h3>Addresses</h3>
                <div className="card-actions">
                  <button className="action-icon" title="Warning">⚠️</button>
                  <button className="action-icon" title="Edit">✏️</button>
                  <button className="action-icon" title="Refresh">🔄</button>
                </div>
              </div>
              <div className="card-content">
                <div className="info-row">
                  <span className="info-label">Address Type:</span>
                  <span className="info-value">N/A</span>
                </div>
                <div className="info-row">
                  <span className="info-label">City:</span>
                  <span className="info-value">N/A</span>
                </div>
                <a href="#" className="view-all-link">View All</a>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'job' && (
          <div className="profile-sections">
            <div className="info-card">
              <div className="card-header">
                <h3>Job Information</h3>
                <div className="card-actions">
                  <button className="action-icon" title="Warning">⚠️</button>
                  <button className="action-icon" title="Edit">✏️</button>
                  <button className="action-icon" title="Refresh">🔄</button>
                </div>
              </div>
              <div className="card-content">
                <div className="info-row">
                  <span className="info-label">Department:</span>
                  <span className="info-value">{employee.department || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Designation:</span>
                  <span className="info-value">{employee.designation || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Joining Date:</span>
                  <span className="info-value">
                    {employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Manager:</span>
                  <span className="info-value">{employee.manager || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Status:</span>
                  <span className="info-value">{employee.status || 'N/A'}</span>
                </div>
                <a href="#" className="view-all-link">View All</a>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'compensation' && (
          <div className="profile-sections">
            <div className="info-card">
              <div className="card-header">
                <h3>Salary Information</h3>
                <div className="card-actions">
                  <button className="action-icon" title="Warning">⚠️</button>
                  <button className="action-icon" title="Edit">✏️</button>
                  <button className="action-icon" title="Refresh">🔄</button>
                </div>
              </div>
              <div className="card-content">
                <div className="info-row">
                  <span className="info-label">CTC (Yearly):</span>
                  <span className="info-value">${employee.salary?.ctc?.toLocaleString() || 0}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Basic Salary:</span>
                  <span className="info-value">${employee.salary?.basic?.toLocaleString() || 0}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">HRA:</span>
                  <span className="info-value">${employee.salary?.hra?.toLocaleString() || 0}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Allowances:</span>
                  <span className="info-value">${employee.salary?.allowances?.toLocaleString() || 0}</span>
                </div>
                <a href="#" className="view-all-link">View All</a>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'time' && (
          <div className="profile-sections">
            <div className="info-card">
              <div className="card-header">
                <h3>Time Management</h3>
                <div className="card-actions">
                  <button className="action-icon" title="Warning">⚠️</button>
                  <button className="action-icon" title="Edit">✏️</button>
                  <button className="action-icon" title="Refresh">🔄</button>
                </div>
              </div>
              <div className="card-content">
                <div className="info-row">
                  <span className="info-label">Work Schedule:</span>
                  <span className="info-value">Full Time</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Standard Hours:</span>
                  <span className="info-value">40 hours/week</span>
                </div>
                <a href="#" className="view-all-link">View All</a>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="profile-sections">
            <div className="info-card">
              <div className="card-header">
                <h3>Performance and Goals</h3>
                <div className="card-actions">
                  <button className="action-icon" title="Warning">⚠️</button>
                  <button className="action-icon" title="Edit">✏️</button>
                  <button className="action-icon" title="Refresh">🔄</button>
                </div>
              </div>
              <div className="card-content">
                <div className="info-row">
                  <span className="info-label">Current Rating:</span>
                  <span className="info-value">N/A</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Last Review Date:</span>
                  <span className="info-value">N/A</span>
                </div>
                <a href="#" className="view-all-link">View All</a>
              </div>
            </div>
          </div>
        )}

        {isEditing && (
          <div className="edit-actions-bar">
            <button onClick={handleSave} className="btn-save">Save Changes</button>
            <button onClick={() => setIsEditing(false)} className="btn-cancel">Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

