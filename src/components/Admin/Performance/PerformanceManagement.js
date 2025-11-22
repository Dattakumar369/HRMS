import React, { useState, useEffect } from 'react';
import { getStorageData, setStorageData } from '../../../utils/dataInitializer';
import './PerformanceManagement.css';

const PerformanceManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setEmployees(getStorageData('ems_employees'));
    setPerformance(getStorageData('ems_performance'));
  };

  const handleEvaluate = (employee) => {
    setSelectedEmployee(employee);
    setShowForm(true);
  };

  const handleSave = (evalData) => {
    const existing = performance.find(p => p.employeeId === evalData.employeeId && p.quarter === evalData.quarter);
    let updated;
    
    if (existing) {
      updated = performance.map(p =>
        p.id === existing.id ? { ...evalData, id: existing.id } : p
      );
    } else {
      const newEval = { ...evalData, id: `perf${Date.now()}` };
      updated = [...performance, newEval];
    }
    
    setStorageData('ems_performance', updated);
    setShowForm(false);
    setSelectedEmployee(null);
    loadData();
  };

  const getEmployeeName = (id) => {
    const emp = employees.find(e => e.id === id);
    return emp ? emp.name : 'Unknown';
  };

  return (
    <div className="performance-management">
      <div className="page-header">
        <h2>Performance Management</h2>
      </div>

      <div className="performance-table-container">
        <table className="performance-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Quarter</th>
              <th>Rating</th>
              <th>Comments</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {performance.map(perf => (
              <tr key={perf.id}>
                <td>{getEmployeeName(perf.employeeId)}</td>
                <td>{perf.quarter}</td>
                <td>
                  <span className="rating-badge">{perf.rating}/5</span>
                </td>
                <td>{perf.comments}</td>
                <td>
                  <button onClick={() => handleEvaluate(employees.find(e => e.id === perf.employeeId))} className="btn-edit">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="employees-list">
        <h3>Evaluate Employee</h3>
        <div className="employees-grid">
          {employees.map(emp => (
            <div key={emp.id} className="employee-card">
              <div className="employee-info">
                <h4>{emp.name}</h4>
                <p>{emp.department}</p>
              </div>
              <button onClick={() => handleEvaluate(emp)} className="btn-evaluate">
                Evaluate
              </button>
            </div>
          ))}
        </div>
      </div>

      {showForm && selectedEmployee && (
        <EvaluationForm
          employee={selectedEmployee}
          existingEval={performance.find(p => p.employeeId === selectedEmployee.id)}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setSelectedEmployee(null);
          }}
        />
      )}
    </div>
  );
};

const EvaluationForm = ({ employee, existingEval, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    employeeId: employee.id,
    quarter: `Q${Math.floor((new Date().getMonth() + 3) / 3)} ${new Date().getFullYear()}`,
    rating: 3,
    comments: ''
  });

  useEffect(() => {
    if (existingEval) {
      setFormData(existingEval);
    }
  }, [existingEval]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h2>Performance Evaluation - {employee.name}</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Quarter</label>
            <input
              type="text"
              value={formData.quarter}
              onChange={(e) => setFormData({ ...formData, quarter: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Rating (1-5) *</label>
            <input
              type="number"
              min="1"
              max="5"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
              required
            />
          </div>
          <div className="form-group">
            <label>Comments</label>
            <textarea
              value={formData.comments}
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
              rows="5"
            />
          </div>
          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-cancel">Cancel</button>
            <button type="submit" className="btn-submit">Save Evaluation</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PerformanceManagement;

