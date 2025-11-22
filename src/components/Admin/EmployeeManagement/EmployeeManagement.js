import React, { useState, useEffect } from 'react';
import { getStorageData, setStorageData } from '../../../utils/dataInitializer';
import EmployeeForm from './EmployeeForm';
import './EmployeeManagement.css';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = () => {
    const data = getStorageData('ems_employees');
    setEmployees(data);
  };

  const handleAdd = () => {
    setEditingEmployee(null);
    setShowForm(true);
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      const updated = employees.filter(emp => emp.id !== id);
      setStorageData('ems_employees', updated);
      setEmployees(updated);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingEmployee(null);
    loadEmployees();
  };

  const handleResetPassword = (id) => {
    const newPassword = Math.random().toString(36).slice(-8);
    alert(`New password generated: ${newPassword}\n(This is a demo - password not actually changed)`);
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="employee-management">
      <div className="page-header">
        <h2>Employee Management</h2>
        <button onClick={handleAdd} className="btn-primary">
          + Add Employee
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search employees by name, email, or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="employees-table-container">
        <table className="employees-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">No employees found</td>
              </tr>
            ) : (
              filteredEmployees.map(emp => (
                <tr key={emp.id}>
                  <td>{emp.employeeId}</td>
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.department}</td>
                  <td>{emp.designation}</td>
                  <td>
                    <span className={`status-badge ${emp.status?.toLowerCase()}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button onClick={() => handleEdit(emp)} className="btn-edit">
                        Edit
                      </button>
                      <button onClick={() => handleResetPassword(emp.id)} className="btn-reset">
                        Reset Password
                      </button>
                      <button onClick={() => handleDelete(emp.id)} className="btn-delete">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <EmployeeForm
          employee={editingEmployee}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
};

export default EmployeeManagement;

