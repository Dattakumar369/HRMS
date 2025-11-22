import React, { useState, useEffect } from 'react';
import { getStorageData, getCurrentUser } from '../../../utils/dataInitializer';
import './Payslips.css';

const Payslips = () => {
  const [employee, setEmployee] = useState(null);
  const [payslips, setPayslips] = useState([]);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      const employees = getStorageData('ems_employees');
      const emp = employees.find(e => e.id === currentUser.id || e.email === currentUser.email);
      setEmployee(emp);

      if (emp) {
        const allPayslips = getStorageData('ems_payslips');
        setPayslips(allPayslips.filter(p => p.employeeId === emp.id));
      }
    }
  }, []);

  if (!employee) {
    return <div>Loading...</div>;
  }

  const basic = employee.salary?.basic || 0;
  const hra = employee.salary?.hra || 0;
  const allowances = employee.salary?.allowances || 0;
  const gross = basic + hra + allowances;
  const tax = gross * 0.1;
  const net = gross - tax;

  return (
    <div className="payslips">
      <div className="page-header">
        <h2>My Payslips</h2>
      </div>

      <div className="salary-overview">
        <div className="overview-card">
          <h3>Salary Overview</h3>
          <div className="salary-breakdown">
            <div className="breakdown-item">
              <span className="breakdown-label">CTC (Yearly)</span>
              <span className="breakdown-value">${employee.salary?.ctc?.toLocaleString() || 0}</span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-label">Monthly Gross</span>
              <span className="breakdown-value">${gross.toFixed(2)}</span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-label">Tax (10%)</span>
              <span className="breakdown-value">${tax.toFixed(2)}</span>
            </div>
            <div className="breakdown-item total">
              <span className="breakdown-label">Net Salary</span>
              <span className="breakdown-value">${net.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="payslips-list">
        <h3>Payslip History</h3>
        {payslips.length === 0 ? (
          <p className="no-data">No payslips generated yet</p>
        ) : (
          <div className="payslips-grid">
            {payslips.map(payslip => (
              <div key={payslip.id} className="payslip-card">
                <div className="payslip-header">
                  <h4>Payslip - {new Date(payslip.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h4>
                </div>
                <div className="payslip-body">
                  <p><strong>Amount:</strong> ${payslip.amount?.toFixed(2)}</p>
                  <p><strong>Generated:</strong> {new Date(payslip.generatedAt).toLocaleDateString()}</p>
                </div>
                <div className="payslip-footer">
                  <button className="btn-download">Download PDF</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Payslips;

