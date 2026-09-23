// Common interfaces used across the application.
// Kept in one file to keep imports simple for a small/medium project.

export interface LoginResponse {
  access: string;
  refresh: string;
  user_id: number;
  username: string;
  role: string;
  first_name: string;
  last_name: string;
}

export interface CurrentUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

export interface Department {
  id: number;
  name: string;
  description: string;
}

export interface Designation {
  id: number;
  title: string;
  department: number;
  department_name?: string;
}

export interface Employee {
  id: number;
  employee_code: string;
  full_name?: string;
  email?: string;
  phone: string;
  address: string;
  department: number | null;
  department_name?: string;
  designation: number | null;
  designation_title?: string;
  date_of_joining: string | null;
  is_active: boolean;
}

export interface EmployeeCreateRequest {
  employee_code: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password?: string;
  department: number | null;
  designation: number | null;
  phone: string;
  address: string;
  date_of_joining: string | null;
  is_active: boolean;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  status: 'PLANNING' | 'ACTIVE' | 'COMPLETED';
  start_date: string | null;
  end_date: string | null;
  manager: number | null;
  manager_name?: string;
  is_active: boolean;
  created_at?: string;
  team_count?: number;
}

export interface ProjectAssignment {
  id: number;
  project: number;
  project_name?: string;
  employee: number;
  employee_name?: string;
  employee_code?: string;
  role_in_project: string;
  assigned_date: string;
}

export interface Attendance {
  id: number;
  employee: number;
  employee_name?: string;
  employee_code?: string;
  date: string;
  check_in: string | null;
  check_out: string | null;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
}

export interface LeaveType {
  id: number;
  name: string;
  max_days_per_year: number;
}

export interface LeaveRequest {
  id: number;
  employee: number;
  employee_name?: string;
  leave_type: number;
  leave_type_name?: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  applied_on?: string;
  number_of_days?: number;
}

export interface SalaryStructure {
  id: number;
  employee: number;
  employee_name?: string;
  basic_salary: number;
  hra: number;
  other_allowances: number;
  deductions: number;
  gross_salary?: number;
  net_salary?: number;
}

export interface Payslip {
  id: number;
  employee: number;
  employee_name?: string;
  month: string;
  year: number;
  basic_salary: number;
  allowances: number;
  deductions: number;
  net_salary: number;
  generated_on?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface AdminDashboardStats {
  total_employees: number;
  total_projects: number;
  active_projects: number;
  completed_projects: number;
  planning_projects: number;
  department_count: number;
  attendance_summary: { present: number; absent: number; late: number };
  pending_leave_requests: number;
  payroll_summary: { total_payslips_this_year: number };
}

export interface EmployeeDashboardData {
  profile: {
    full_name: string;
    employee_code: string;
    department: string | null;
    designation: string | null;
  };
  assigned_projects: { id: number; name: string; status: string; role_in_project: string }[];
  today_attendance: { status: string; check_in: string | null; check_out: string | null };
  pending_leave_requests: number;
  recent_payslip: { month: string; year: number; net_salary: number } | null;
}
