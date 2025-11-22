import React, { useState, useEffect } from 'react';
import { getStorageData, getCurrentUser } from '../../../utils/dataInitializer';
import { getSmallAvatar, getInitials } from '../../../utils/avatarHelper';
import './TeamsOrg.css';

const TeamsOrg = () => {
  const [employee, setEmployee] = useState(null);
  const [teams, setTeams] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [manager, setManager] = useState(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      const employees = getStorageData('ems_employees');
      const emp = employees.find(e => e.id === currentUser.id || e.email === currentUser.email);
      setEmployee(emp);

      if (emp) {
        const allTeams = getStorageData('ems_teams');
        const myTeam = allTeams.find(t => t.members?.includes(emp.id) || t.lead === emp.name);
        setTeams(myTeam ? [myTeam] : []);

        if (myTeam) {
          const allEmployees = getStorageData('ems_employees');
          const members = allEmployees.filter(e => myTeam.members?.includes(e.id));
          setTeamMembers(members);
        }

        if (emp.manager) {
          const allEmployees = getStorageData('ems_employees');
          const mgr = allEmployees.find(e => e.name === emp.manager);
          setManager(mgr);
        }
      }
    }
  }, []);

  if (!employee) {
    return <div>Loading...</div>;
  }

  return (
    <div className="teams-org">
      <div className="page-header">
        <h2>Teams & Organization</h2>
      </div>

      <div className="org-sections">
        <div className="section-card">
          <h3>My Team</h3>
          {teams.length === 0 ? (
            <p className="no-data">Not assigned to any team</p>
          ) : (
            teams.map(team => (
              <div key={team.id} className="team-info">
                <h4>{team.name}</h4>
                <p>Department: {team.department}</p>
                <p>Team Lead: {team.lead}</p>
              </div>
            ))
          )}
        </div>

        <div className="section-card">
          <h3>Team Members</h3>
          {teamMembers.length === 0 ? (
            <p className="no-data">No team members</p>
          ) : (
            <div className="members-grid">
              {teamMembers.map(member => (
                <div key={member.id} className="member-card">
                  <div className="member-avatar">
                    <img
                      src={getSmallAvatar(member, 50)}
                      alt={member.name}
                      className="member-avatar-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="member-avatar-fallback" style={{ display: 'none' }}>
                      {getInitials(member.name)}
                    </div>
                  </div>
                  <div className="member-info">
                    <h4>{member.name}</h4>
                    <p>{member.designation}</p>
                    <p>{member.department}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="section-card">
          <h3>Manager</h3>
          {manager ? (
            <div className="manager-card">
              <div className="manager-avatar">
                <img
                  src={getSmallAvatar(manager, 60)}
                  alt={manager.name}
                  className="manager-avatar-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="manager-avatar-fallback" style={{ display: 'none' }}>
                  {getInitials(manager.name)}
                </div>
              </div>
              <div className="manager-info">
                <h4>{manager.name}</h4>
                <p>{manager.designation}</p>
                <p>{manager.department}</p>
                <p>{manager.email}</p>
              </div>
            </div>
          ) : (
            <p className="no-data">No manager assigned</p>
          )}
        </div>

        <div className="section-card">
          <h3>Organization Structure</h3>
          <div className="org-tree">
            <div className="org-node">
              <div className="node-content">
                <strong>CEO</strong>
              </div>
              <div className="node-children">
                <div className="org-node">
                  <div className="node-content">
                    <strong>{employee.department} Department</strong>
                  </div>
                  <div className="node-children">
                    {manager && (
                      <div className="org-node">
                        <div className="node-content">
                          {manager.name} (Manager)
                        </div>
                        <div className="node-children">
                          <div className="org-node">
                            <div className="node-content">
                              {employee.name} (You)
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamsOrg;

