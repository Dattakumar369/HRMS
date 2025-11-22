import React, { useState, useEffect } from 'react';
import { getStorageData, setStorageData } from '../../../utils/dataInitializer';
import { getEmployeeAvatar, getInitials } from '../../../utils/avatarHelper';
import './EmployeeForm.css';

const EmployeeForm = ({ employee, onClose }) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    name: '',
    email: '',
    contactNo: '',
    gender: 'Male',
    role: 'Employee',
    department: '',
    designation: '',
    joiningDate: '',
    workLocation: '',
    manager: '',
    status: 'Active',
    salary: {
      ctc: '',
      basic: '',
      hra: '',
      allowances: ''
    }
  });

  const departments = getStorageData('ems_departments');
  const employees = getStorageData('ems_employees');

  useEffect(() => {
    if (employee) {
      setFormData(employee);
    } else {
      // Generate new employee ID
      const maxId = employees.reduce((max, emp) => {
        const num = parseInt(emp.employeeId?.replace('EMP', '') || '0');
        return num > max ? num : max;
      }, 0);
      setFormData(prev => ({
        ...prev,
        employeeId: `EMP${String(maxId + 1).padStart(3, '0')}`
      }));
    }
  }, [employee, employees]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('salary.')) {
      const salaryField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        salary: {
          ...prev.salary,
          [salaryField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          profileImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const employees = getStorageData('ems_employees');
    
    if (employee) {
      // Update existing
      const updated = employees.map(emp =>
        emp.id === employee.id ? { ...formData, id: employee.id } : emp
      );
      setStorageData('ems_employees', updated);
    } else {
      // Add new
      const newEmployee = {
        ...formData,
        id: `emp${Date.now()}`,
        salary: {
          ctc: parseFloat(formData.salary.ctc) || 0,
          basic: parseFloat(formData.salary.basic) || 0,
          hra: parseFloat(formData.salary.hra) || 0,
          allowances: parseFloat(formData.salary.allowances) || 0
        }
      };
      setStorageData('ems_employees', [...employees, newEmployee]);
      
      // Also add to users
      const users = getStorageData('ems_users');
      const DEMO_EMP_PASSWORD = process.env.REACT_APP_DEMO_EMP_PASSWORD || 'demo_emp_2024';
      const newUser = {
        id: newEmployee.id,
        email: newEmployee.email,
        password: DEMO_EMP_PASSWORD, // Demo password - should be changed on first login in production
        role: 'Employee',
        name: newEmployee.name
      };
      setStorageData('ems_users', [...users, newUser]);
    }
    
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="employee-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h2>{employee ? 'Edit Employee' : 'Add New Employee'}</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <form onSubmit={handleSubmit} className="employee-form">
          <div className="form-section">
            <h3>Profile Picture</h3>
            <div className="profile-picture-section">
              <div className="profile-preview">
                {formData.profileImage ? (
                  <img src={formData.profileImage} alt="Profile" className="profile-preview-image" />
                ) : (
                  <div className="profile-preview-placeholder">
                    {formData.name ? (
                      <img src={getEmployeeAvatar(formData)} alt="Avatar" className="profile-preview-image" />
                    ) : (
                      <span>{getInitials(formData.name || 'E')}</span>
                    )}
                  </div>
                )}
              </div>
              <label className="upload-image-label">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                {formData.profileImage ? 'Change Picture' : 'Upload Picture'}
              </label>
            </div>
          </div>

          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Employee ID</label>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  required
                  disabled={!!employee}
                />
              </div>

              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Contact No</label>
                <input
                  type="tel"
                  name="contactNo"
                  value={formData.contactNo}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Role</label>
                <select name="role" value={formData.role} onChange={handleChange}>
                  <option value="Employee">Employee</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Job Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Department *</label>
                <select name="department" value={formData.department} onChange={handleChange} required>
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.name}>{dept.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Designation *</label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Joining Date *</label>
                <input
                  type="date"
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Work Location</label>
                <input
                  type="text"
                  name="workLocation"
                  value={formData.workLocation}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Manager</label>
                <select name="manager" value={formData.manager} onChange={handleChange}>
                  <option value="">Select Manager</option>
                  {employees.filter(e => e.role === 'Manager' || e.role === 'Admin').map(emp => (
                    <option key={emp.id} value={emp.name}>{emp.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Salary Structure</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>CTC (Yearly)</label>
                <input
                  type="number"
                  name="salary.ctc"
                  value={formData.salary.ctc}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Basic Salary</label>
                <input
                  type="number"
                  name="salary.basic"
                  value={formData.salary.basic}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>HRA</label>
                <input
                  type="number"
                  name="salary.hra"
                  value={formData.salary.hra}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Allowances</label>
                <input
                  type="number"
                  name="salary.allowances"
                  value={formData.salary.allowances}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              {employee ? 'Update' : 'Add'} Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;

