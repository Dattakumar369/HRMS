// Initialize demo data in sessionStorage
export const initializeDemoData = () => {
  // Only initialize if data doesn't exist
  if (sessionStorage.getItem('ems_initialized')) {
    return;
  }

  // Default users
  // NOTE: These are demo credentials for testing purposes only
  // In production, passwords should be hashed and stored securely
  const DEMO_ADMIN_PASSWORD = process.env.REACT_APP_DEMO_ADMIN_PASSWORD || 'demo_admin';
  const DEMO_EMP_PASSWORD = process.env.REACT_APP_DEMO_EMP_PASSWORD || 'demo_emp';
  
  const users = [
    {
      id: 'admin1',
      email: 'admin@ems.com',
      password: DEMO_ADMIN_PASSWORD,
      role: 'Admin',
      name: 'Admin User'
    },
    {
      id: 'emp1',
      email: 'priya.sharma@ems.com',
      password: DEMO_EMP_PASSWORD,
      role: 'Employee',
      name: 'Priya Sharma',
      employeeId: 'EMP001'
    },
    {
      id: 'emp2',
      email: 'anjali.patel@ems.com',
      password: DEMO_EMP_PASSWORD,
      role: 'Employee',
      name: 'Anjali Patel',
      employeeId: 'EMP002'
    },
    {
      id: 'emp3',
      email: 'kavya.reddy@ems.com',
      password: DEMO_EMP_PASSWORD,
      role: 'Employee',
      name: 'Kavya Reddy',
      employeeId: 'EMP003'
    },
    {
      id: 'emp4',
      email: 'meera.singh@ems.com',
      password: DEMO_EMP_PASSWORD,
      role: 'Employee',
      name: 'Meera Singh',
      employeeId: 'EMP004'
    },
    {
      id: 'emp5',
      email: 'divya.kumar@ems.com',
      password: DEMO_EMP_PASSWORD,
      role: 'Employee',
      name: 'Divya Kumar',
      employeeId: 'EMP005'
    },
    {
      id: 'emp6',
      email: 'sneha.iyer@ems.com',
      password: DEMO_EMP_PASSWORD,
      role: 'Employee',
      name: 'Sneha Iyer',
      employeeId: 'EMP006'
    }
  ];

  // Default employees (All Female - Indian Names)
  const employees = [
    {
      id: 'emp1',
      employeeId: 'EMP001',
      name: 'Priya Sharma',
      email: 'priya@ems.com',
      contactNo: '+91 9876543210',
      gender: 'Female',
      role: 'Employee',
      department: 'Engineering',
      designation: 'Senior Software Engineer',
      joiningDate: '2023-01-15',
      workLocation: 'Bangalore',
      manager: 'Rekha Menon',
      status: 'Active',
      salary: {
        ctc: 95000,
        basic: 47500,
        hra: 23750,
        allowances: 23750
      }
    },
    {
      id: 'emp2',
      employeeId: 'EMP002',
      name: 'Anjali Patel',
      email: 'anjali.patel@ems.com',
      contactNo: '+91 9876543211',
      gender: 'Female',
      role: 'Employee',
      department: 'Marketing',
      designation: 'Marketing Manager',
      joiningDate: '2022-06-10',
      workLocation: 'Mumbai',
      manager: 'Sunita Desai',
      status: 'Active',
      salary: {
        ctc: 105000,
        basic: 52500,
        hra: 26250,
        allowances: 26250
      }
    },
    {
      id: 'emp3',
      employeeId: 'EMP003',
      name: 'Kavya Reddy',
      email: 'kavya.reddy@ems.com',
      contactNo: '+91 9876543212',
      gender: 'Female',
      role: 'Employee',
      department: 'HR',
      designation: 'HR Manager',
      joiningDate: '2022-03-20',
      workLocation: 'Hyderabad',
      manager: 'Lakshmi Nair',
      status: 'Active',
      salary: {
        ctc: 88000,
        basic: 44000,
        hra: 22000,
        allowances: 22000
      }
    },
    {
      id: 'emp4',
      employeeId: 'EMP004',
      name: 'Meera Singh',
      email: 'meera.singh@ems.com',
      contactNo: '+91 9876543213',
      gender: 'Female',
      role: 'Employee',
      department: 'Engineering',
      designation: 'Frontend Developer',
      joiningDate: '2023-05-12',
      workLocation: 'Pune',
      manager: 'Rekha Menon',
      status: 'Active',
      salary: {
        ctc: 82000,
        basic: 41000,
        hra: 20500,
        allowances: 20500
      }
    },
    {
      id: 'emp5',
      employeeId: 'EMP005',
      name: 'Divya Kumar',
      email: 'divya.kumar@ems.com',
      contactNo: '+91 9876543214',
      gender: 'Female',
      role: 'Employee',
      department: 'Sales',
      designation: 'Sales Executive',
      joiningDate: '2023-08-01',
      workLocation: 'Delhi',
      manager: 'Pooja Gupta',
      status: 'Active',
      salary: {
        ctc: 75000,
        basic: 37500,
        hra: 18750,
        allowances: 18750
      }
    },
    {
      id: 'emp6',
      employeeId: 'EMP006',
      name: 'Sneha Iyer',
      email: 'sneha.iyer@ems.com',
      contactNo: '+91 9876543215',
      gender: 'Female',
      role: 'Employee',
      department: 'Engineering',
      designation: 'Backend Developer',
      joiningDate: '2023-02-28',
      workLocation: 'Chennai',
      manager: 'Rekha Menon',
      status: 'Active',
      salary: {
        ctc: 90000,
        basic: 45000,
        hra: 22500,
        allowances: 22500
      }
    }
  ];

  // Default departments
  const departments = [
    { id: 'dept1', name: 'Engineering', head: 'Rekha Menon', employeeCount: 3 },
    { id: 'dept2', name: 'Marketing', head: 'Sunita Desai', employeeCount: 1 },
    { id: 'dept3', name: 'HR', head: 'Lakshmi Nair', employeeCount: 1 },
    { id: 'dept4', name: 'Sales', head: 'Pooja Gupta', employeeCount: 1 }
  ];

  // Default teams
  const teams = [
    { id: 'team1', name: 'Frontend Team', department: 'Engineering', lead: 'Priya Sharma', members: ['emp1', 'emp4'] },
    { id: 'team2', name: 'Backend Team', department: 'Engineering', lead: 'Sneha Iyer', members: ['emp6'] },
    { id: 'team3', name: 'Digital Marketing', department: 'Marketing', lead: 'Anjali Patel', members: ['emp2'] },
    { id: 'team4', name: 'HR Team', department: 'HR', lead: 'Kavya Reddy', members: ['emp3'] },
    { id: 'team5', name: 'Sales Team', department: 'Sales', lead: 'Divya Kumar', members: ['emp5'] }
  ];

  // Default announcements
  const announcements = [
    {
      id: 'ann1',
      title: 'Company Holiday - New Year',
      content: 'Office will be closed on January 1st for New Year celebration.',
      type: 'High',
      validFrom: '2024-01-01',
      validTo: '2024-01-01',
      createdBy: 'admin1',
      createdAt: new Date().toISOString()
    },
    {
      id: 'ann2',
      title: 'Team Building Event',
      content: 'Join us for the annual team building event on January 15th.',
      type: 'Medium',
      validFrom: '2024-01-10',
      validTo: '2024-01-15',
      createdBy: 'admin1',
      createdAt: new Date().toISOString()
    }
  ];

  // Default holidays
  const holidays = [
    { id: 'hol1', name: 'New Year', date: '2024-01-01', type: 'National' },
    { id: 'hol2', name: 'Independence Day', date: '2024-07-04', type: 'National' },
    { id: 'hol3', name: 'Christmas', date: '2024-12-25', type: 'National' }
  ];

  // Store in sessionStorage
  sessionStorage.setItem('ems_users', JSON.stringify(users));
  sessionStorage.setItem('ems_employees', JSON.stringify(employees));
  sessionStorage.setItem('ems_departments', JSON.stringify(departments));
  sessionStorage.setItem('ems_teams', JSON.stringify(teams));
  sessionStorage.setItem('ems_announcements', JSON.stringify(announcements));
  sessionStorage.setItem('ems_holidays', JSON.stringify(holidays));
  sessionStorage.setItem('ems_attendance', JSON.stringify([]));
  sessionStorage.setItem('ems_timesheets', JSON.stringify([]));
  sessionStorage.setItem('ems_leaves', JSON.stringify([]));
  sessionStorage.setItem('ems_payslips', JSON.stringify([]));
  sessionStorage.setItem('ems_performance', JSON.stringify([]));
  sessionStorage.setItem('ems_initialized', 'true');
};

// Helper functions to get/set data
export const getStorageData = (key) => {
  const data = sessionStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

export const setStorageData = (key, data) => {
  sessionStorage.setItem(key, JSON.stringify(data));
};

export const getCurrentUser = () => {
  const userStr = sessionStorage.getItem('ems_currentUser');
  return userStr ? JSON.parse(userStr) : null;
};

export const setCurrentUser = (user) => {
  sessionStorage.setItem('ems_currentUser', JSON.stringify(user));
};

export const logout = () => {
  sessionStorage.removeItem('ems_currentUser');
};

