# Employee Management System (EMS)

A comprehensive web-based Employee Management System built with React JS. This is a demo version that uses session storage for data persistence.

## Features

### Admin Features
- **Dashboard**: Overview with employee statistics, charts, and analytics
- **Employee Management**: Full CRUD operations for employees
- **Teams & Departments**: Manage organizational structure
- **Attendance Management**: Track and manage employee attendance
- **Timesheets**: Approve/reject employee timesheet submissions
- **Leave Management**: Handle leave requests and holiday calendar
- **Payroll Management**: Generate payslips and manage payroll
- **Announcements**: Create and manage company announcements
- **Performance Management**: Employee performance evaluations
- **Settings**: Organization settings and data management

### Employee Features
- **Dashboard**: Personal dashboard with attendance status and quick actions
- **Profile**: View and edit personal information
- **Attendance**: Clock in/out, view attendance calendar and logs
- **Timesheets**: Submit daily timesheets
- **Leaves**: Apply for leave and check leave balance
- **Payslips**: View salary breakdown and download payslips
- **Documents**: Access company documents and upload personal documents
- **Announcements**: View company announcements
- **Teams & Organization**: View team members and organizational structure

## Technology Stack

- React 18.2.0
- React Router DOM 6.20.0
- Recharts 2.10.3 (for charts and graphs)
- date-fns 2.30.0 (for date manipulation)
- jsPDF 2.5.1 (for PDF generation)
- Session Storage (for data persistence)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## Demo Credentials

### Admin Login
- **Email**: admin@ems.com
- **Password**: admin123

### Employee Login
- **Email**: priya.sharma@ems.com (or any employee email)
- **Password**: emp123

**Available Employee Accounts:**
- priya.sharma@ems.com
- anjali.patel@ems.com
- kavya.reddy@ems.com
- meera.singh@ems.com
- divya.kumar@ems.com
- sneha.iyer@ems.com

## Project Structure

```
src/
├── components/
│   ├── Admin/          # Admin-specific components
│   │   ├── Dashboard/
│   │   ├── EmployeeManagement/
│   │   ├── TeamsDepartments/
│   │   ├── Attendance/
│   │   ├── Timesheets/
│   │   ├── Leave/
│   │   ├── Payroll/
│   │   ├── Announcements/
│   │   ├── Performance/
│   │   └── Settings/
│   ├── Employee/       # Employee-specific components
│   │   ├── Dashboard/
│   │   ├── Profile/
│   │   ├── Attendance/
│   │   ├── Timesheets/
│   │   ├── Leave/
│   │   ├── Payslips/
│   │   ├── Documents/
│   │   ├── Announcements/
│   │   └── TeamsOrg/
│   ├── Auth/          # Authentication components
│   └── Layout/        # Layout components (Sidebar, Header)
├── utils/
│   └── dataInitializer.js  # Data initialization utilities
└── App.js             # Main application component
```

## Data Storage

This demo version uses browser session storage to persist data. All data is stored in `sessionStorage` with keys prefixed with `ems_`:

- `ems_users`: User credentials
- `ems_employees`: Employee data
- `ems_departments`: Department information
- `ems_teams`: Team information
- `ems_attendance`: Attendance records
- `ems_timesheets`: Timesheet submissions
- `ems_leaves`: Leave requests
- `ems_payslips`: Generated payslips
- `ems_announcements`: Company announcements
- `ems_holidays`: Holiday calendar
- `ems_performance`: Performance evaluations

## Key Features

### Role-Based Access
- Separate dashboards for Admin and Employee roles
- Protected routes based on user role
- Role-specific navigation menus

### Responsive Design
- Mobile-friendly interface
- Clean and modern UI
- Corporate design theme

### Data Management
- Backup and restore functionality (Settings)
- Real-time data updates
- Form validations

## Future Enhancements

For production deployment, consider:
- Backend API integration (Node.js/Spring Boot/.NET)
- Database (SQL/NoSQL)
- JWT authentication
- Real-time notifications
- WebSocket for live updates
- Biometric device integration
- Advanced payroll compliance
- Employee onboarding workflows

## Notes

- This is a demo version using static data storage
- All data is stored in browser session storage
- Data persists only during the browser session
- For production use, implement proper backend and database

## License

This project is created for demonstration purposes.

