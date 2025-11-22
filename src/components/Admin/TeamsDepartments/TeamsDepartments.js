import React, { useState, useEffect } from 'react';
import { getStorageData, setStorageData } from '../../../utils/dataInitializer';
import './TeamsDepartments.css';

const TeamsDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showDeptForm, setShowDeptForm] = useState(false);
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [editingTeam, setEditingTeam] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setDepartments(getStorageData('ems_departments'));
    setTeams(getStorageData('ems_teams'));
    setEmployees(getStorageData('ems_employees'));
  };

  const handleAddDept = () => {
    setEditingDept(null);
    setShowDeptForm(true);
  };

  const handleEditDept = (dept) => {
    setEditingDept(dept);
    setShowDeptForm(true);
  };

  const handleDeleteDept = (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      const updated = departments.filter(d => d.id !== id);
      setStorageData('ems_departments', updated);
      setDepartments(updated);
    }
  };

  const handleSaveDept = (deptData) => {
    if (editingDept) {
      const updated = departments.map(d => d.id === editingDept.id ? { ...deptData, id: editingDept.id } : d);
      setStorageData('ems_departments', updated);
    } else {
      const newDept = { ...deptData, id: `dept${Date.now()}`, employeeCount: 0 };
      setStorageData('ems_departments', [...departments, newDept]);
    }
    setShowDeptForm(false);
    setEditingDept(null);
    loadData();
  };

  const handleAddTeam = () => {
    setEditingTeam(null);
    setShowTeamForm(true);
  };

  const handleEditTeam = (team) => {
    setEditingTeam(team);
    setShowTeamForm(true);
  };

  const handleDeleteTeam = (id) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      const updated = teams.filter(t => t.id !== id);
      setStorageData('ems_teams', updated);
      setTeams(updated);
    }
  };

  const handleSaveTeam = (teamData) => {
    if (editingTeam) {
      const updated = teams.map(t => t.id === editingTeam.id ? { ...teamData, id: editingTeam.id } : t);
      setStorageData('ems_teams', updated);
    } else {
      const newTeam = { ...teamData, id: `team${Date.now()}`, members: [] };
      setStorageData('ems_teams', [...teams, newTeam]);
    }
    setShowTeamForm(false);
    setEditingTeam(null);
    loadData();
  };

  return (
    <div className="teams-departments">
      <div className="page-header">
        <h2>Teams & Departments</h2>
      </div>

      <div className="sections-container">
        {/* Departments Section */}
        <div className="section-card">
          <div className="section-header">
            <h3>Departments</h3>
            <button onClick={handleAddDept} className="btn-primary">+ Add Department</button>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Head</th>
                  <th>Employee Count</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {departments.map(dept => (
                  <tr key={dept.id}>
                    <td>{dept.name}</td>
                    <td>{dept.head}</td>
                    <td>{dept.employeeCount}</td>
                    <td>
                      <button onClick={() => handleEditDept(dept)} className="btn-edit">Edit</button>
                      <button onClick={() => handleDeleteDept(dept.id)} className="btn-delete">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Teams Section */}
        <div className="section-card">
          <div className="section-header">
            <h3>Teams</h3>
            <button onClick={handleAddTeam} className="btn-primary">+ Add Team</button>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Team Lead</th>
                  <th>Members</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teams.map(team => (
                  <tr key={team.id}>
                    <td>{team.name}</td>
                    <td>{team.department}</td>
                    <td>{team.lead}</td>
                    <td>{team.members?.length || 0}</td>
                    <td>
                      <button onClick={() => handleEditTeam(team)} className="btn-edit">Edit</button>
                      <button onClick={() => handleDeleteTeam(team.id)} className="btn-delete">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showDeptForm && (
        <DeptForm
          department={editingDept}
          onSave={handleSaveDept}
          onClose={() => {
            setShowDeptForm(false);
            setEditingDept(null);
          }}
        />
      )}

      {showTeamForm && (
        <TeamForm
          team={editingTeam}
          departments={departments}
          employees={employees}
          onSave={handleSaveTeam}
          onClose={() => {
            setShowTeamForm(false);
            setEditingTeam(null);
          }}
        />
      )}
    </div>
  );
};

const DeptForm = ({ department, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    head: '',
    employeeCount: 0
  });

  useEffect(() => {
    if (department) {
      setFormData(department);
    }
  }, [department]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h2>{department ? 'Edit Department' : 'Add Department'}</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Department Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Department Head</label>
            <input
              type="text"
              value={formData.head}
              onChange={(e) => setFormData({ ...formData, head: e.target.value })}
            />
          </div>
          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-cancel">Cancel</button>
            <button type="submit" className="btn-submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TeamForm = ({ team, departments, employees, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    lead: '',
    members: []
  });

  useEffect(() => {
    if (team) {
      setFormData(team);
    }
  }, [team]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h2>{team ? 'Edit Team' : 'Add Team'}</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Team Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Department *</label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              required
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.name}>{dept.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Team Lead</label>
            <select
              value={formData.lead}
              onChange={(e) => setFormData({ ...formData, lead: e.target.value })}
            >
              <option value="">Select Team Lead</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.name}>{emp.name}</option>
              ))}
            </select>
          </div>
          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-cancel">Cancel</button>
            <button type="submit" className="btn-submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamsDepartments;

