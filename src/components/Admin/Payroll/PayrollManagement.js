import React, { useState, useEffect } from 'react';
import { getStorageData, setStorageData } from '../../../utils/dataInitializer';
import jsPDF from 'jspdf';
import './PayrollManagement.css';

const PayrollManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [payslips, setPayslips] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setEmployees(getStorageData('ems_employees'));
    setPayslips(getStorageData('ems_payslips'));
  };

  const generatePayslip = (employee) => {
    const doc = new jsPDF();
    const month = new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    doc.setFontSize(18);
    doc.text('PAYSLIP', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Employee: ${employee.name}`, 20, 40);
    doc.text(`Employee ID: ${employee.employeeId}`, 20, 50);
    doc.text(`Month: ${month}`, 20, 60);
    doc.text(`Department: ${employee.department}`, 20, 70);

    doc.setFontSize(14);
    doc.text('Earnings', 20, 90);
    doc.text('Amount', 150, 90);

    let yPos = 100;
    const basic = employee.salary?.basic || 0;
    const hra = employee.salary?.hra || 0;
    const allowances = employee.salary?.allowances || 0;
    const gross = basic + hra + allowances;

    doc.setFontSize(10);
    doc.text(`Basic Salary: $${basic.toFixed(2)}`, 20, yPos);
    doc.text(`$${basic.toFixed(2)}`, 150, yPos);
    yPos += 10;
    
    doc.text(`HRA: $${hra.toFixed(2)}`, 20, yPos);
    doc.text(`$${hra.toFixed(2)}`, 150, yPos);
    yPos += 10;
    
    doc.text(`Allowances: $${allowances.toFixed(2)}`, 20, yPos);
    doc.text(`$${allowances.toFixed(2)}`, 150, yPos);
    yPos += 10;

    doc.setFontSize(12);
    doc.text('Gross Salary:', 20, yPos);
    doc.text(`$${gross.toFixed(2)}`, 150, yPos);
    yPos += 15;

    doc.setFontSize(14);
    doc.text('Deductions', 20, yPos);
    yPos += 10;

    const tax = gross * 0.1;
    const net = gross - tax;

    doc.setFontSize(10);
    doc.text(`Tax (10%): $${tax.toFixed(2)}`, 20, yPos);
    doc.text(`$${tax.toFixed(2)}`, 150, yPos);
    yPos += 15;

    doc.setFontSize(12);
    doc.text('Net Salary:', 20, yPos);
    doc.text(`$${net.toFixed(2)}`, 150, yPos);

    const filename = `Payslip_${employee.employeeId}_${month}.pdf`;
    doc.save(filename);

    // Save to payslips
    const newPayslip = {
      id: `payslip${Date.now()}`,
      employeeId: employee.id,
      month: selectedMonth,
      amount: net,
      generatedAt: new Date().toISOString()
    };
    setStorageData('ems_payslips', [...payslips, newPayslip]);
    loadData();
  };

  return (
    <div className="payroll-management">
      <div className="page-header">
        <h2>Payroll Management</h2>
        <div className="header-actions">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="month-input"
          />
        </div>
      </div>

      <div className="payroll-stats">
        <div className="stat-card">
          <h3>Total Employees</h3>
          <p className="stat-value">{employees.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Payroll (Monthly)</h3>
          <p className="stat-value">
            ${employees.reduce((sum, emp) => {
              const basic = emp.salary?.basic || 0;
              const hra = emp.salary?.hra || 0;
              const allowances = emp.salary?.allowances || 0;
              const gross = basic + hra + allowances;
              const tax = gross * 0.1;
              return sum + (gross - tax);
            }, 0).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="employees-payroll-table">
        <table className="payroll-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Department</th>
              <th>CTC</th>
              <th>Monthly Gross</th>
              <th>Net Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => {
              const basic = emp.salary?.basic || 0;
              const hra = emp.salary?.hra || 0;
              const allowances = emp.salary?.allowances || 0;
              const gross = basic + hra + allowances;
              const tax = gross * 0.1;
              const net = gross - tax;

              return (
                <tr key={emp.id}>
                  <td>{emp.name}</td>
                  <td>{emp.department}</td>
                  <td>${emp.salary?.ctc?.toLocaleString() || 0}</td>
                  <td>${gross.toFixed(2)}</td>
                  <td>${net.toFixed(2)}</td>
                  <td>
                    <button onClick={() => generatePayslip(emp)} className="btn-generate">
                      Generate Payslip
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayrollManagement;

