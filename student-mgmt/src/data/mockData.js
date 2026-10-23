export const mockStudents = [
  { id: 'STU-001', name: 'Sokha Chann', gender: 'Male', dob: '2002-03-14', phone: '012-345-678', email: 'sokha.chann@school.edu', address: 'Phnom Penh, Cambodia', class: 'M1', status: 'Active', gpa: 3.8, avatar: 'SC', enrolled: '2022-09-01' },
  { id: 'STU-002', name: 'Sreyleak Pov', gender: 'Female', dob: '2003-07-22', phone: '095-234-567', email: 'sreyleak.pov@school.edu', address: 'Siem Reap, Cambodia', class: 'M2', status: 'Active', gpa: 3.5, avatar: 'SP', enrolled: '2022-09-01' },
  { id: 'STU-003', name: 'Dara Meas', gender: 'Male', dob: '2001-11-05', phone: '077-456-789', email: 'dara.meas@school.edu', address: 'Battambang, Cambodia', class: 'M3', status: 'Active', gpa: 2.9, avatar: 'DM', enrolled: '2021-09-01' },
  { id: 'STU-004', name: 'Pisey Keo', gender: 'Female', dob: '2002-01-18', phone: '070-567-890', email: 'pisey.keo@school.edu', address: 'Phnom Penh, Cambodia', class: 'M4', status: 'Inactive', gpa: 3.2, avatar: 'PK', enrolled: '2021-09-01' },
  { id: 'STU-005', name: 'Bunna Lim', gender: 'Male', dob: '2000-05-30', phone: '096-678-901', email: 'bunna.lim@school.edu', address: 'Kampot, Cambodia', class: 'M5', status: 'Active', gpa: 3.9, avatar: 'BL', enrolled: '2020-09-01' },
  { id: 'STU-006', name: 'Channary Uth', gender: 'Female', dob: '2000-09-12', phone: '088-789-012', email: 'channary.uth@school.edu', address: 'Phnom Penh, Cambodia', class: 'M6', status: 'Active', gpa: 3.6, avatar: 'CU', enrolled: '2020-09-01' },
  { id: 'STU-007', name: 'Ratha Kong', gender: 'Male', dob: '2003-02-28', phone: '011-890-123', email: 'ratha.kong@school.edu', address: 'Kandal, Cambodia', class: 'M1', status: 'Active', gpa: 2.7, avatar: 'RK', enrolled: '2022-09-01' },
  { id: 'STU-008', name: 'Maly Heng', gender: 'Female', dob: '2001-06-08', phone: '097-901-234', email: 'maly.heng@school.edu', address: 'Prey Veng, Cambodia', class: 'M3', status: 'Graduated', gpa: 4.0, avatar: 'MH', enrolled: '2021-09-01' },
  { id: 'STU-009', name: 'Virak Sao', gender: 'Male', dob: '2002-12-15', phone: '093-012-345', email: 'virak.sao@school.edu', address: 'Phnom Penh, Cambodia', class: 'M2', status: 'Active', gpa: 3.1, avatar: 'VS', enrolled: '2022-09-01' },
  { id: 'STU-010', name: 'Bopha Nou', gender: 'Female', dob: '2003-04-04', phone: '089-123-456', email: 'bopha.nou@school.edu', address: 'Takeo, Cambodia', class: 'M1', status: 'Active', gpa: 3.4, avatar: 'BN', enrolled: '2022-09-01' },
  { id: 'STU-011', name: 'Makara Yim', gender: 'Male', dob: '2001-08-20', phone: '086-234-567', email: 'makara.yim@school.edu', address: 'Kampong Cham, Cambodia', class: 'M5', status: 'Active', gpa: 3.7, avatar: 'MY', enrolled: '2020-09-01' },
  { id: 'STU-012', name: 'Sothea Ros', gender: 'Female', dob: '2002-10-10', phone: '092-345-678', email: 'sothea.ros@school.edu', address: 'Phnom Penh, Cambodia', class: 'M4', status: 'Inactive', gpa: 2.5, avatar: 'SR', enrolled: '2021-09-01' },
]

export const mockClasses = [
  { id: 'CLS-001', name: 'M1', teacher: 'Mr. Vanna Sok', students: 3, room: 'Room 101', schedule: 'Mon–Fri 7:00–11:30', subject: 'General Studies' },
  { id: 'CLS-002', name: 'M2', teacher: 'Ms. Sreymom Tan', students: 2, room: 'Room 102', schedule: 'Mon–Fri 7:00–11:30', subject: 'General Studies' },
  { id: 'CLS-003', name: 'M3', teacher: 'Mr. Piseth Chan', students: 2, room: 'Room 201', schedule: 'Mon–Fri 7:00–11:30', subject: 'Science Track' },
  { id: 'CLS-004', name: 'M4', teacher: 'Ms. Kolab Pich', students: 2, room: 'Room 202', schedule: 'Mon–Fri 7:00–11:30', subject: 'Social Track' },
  { id: 'CLS-005', name: 'M5', teacher: 'Mr. Sovann Im', students: 2, room: 'Room 301', schedule: 'Mon–Fri 7:00–11:30', subject: 'Science Track' },
  { id: 'CLS-006', name: 'M6', teacher: 'Ms. Ratana Khem', students: 1, room: 'Room 302', schedule: 'Mon–Fri 7:00–11:30', subject: 'Social Track' },
]

export const mockAttendance = [
  { id: 1, studentId: 'STU-001', studentName: 'Sokha Chann', class: 'M1', date: '2026-06-09', status: 'Present', note: '' },
  { id: 2, studentId: 'STU-002', studentName: 'Sreyleak Pov', class: 'M2', date: '2026-06-09', status: 'Present', note: '' },
  { id: 3, studentId: 'STU-003', studentName: 'Dara Meas', class: 'M3', date: '2026-06-09', status: 'Absent', note: 'Sick' },
  { id: 4, studentId: 'STU-004', studentName: 'Pisey Keo', class: 'M4', date: '2026-06-09', status: 'Late', note: 'Traffic' },
  { id: 5, studentId: 'STU-005', studentName: 'Bunna Lim', class: 'M5', date: '2026-06-09', status: 'Present', note: '' },
  { id: 6, studentId: 'STU-006', studentName: 'Channary Uth', class: 'M6', date: '2026-06-09', status: 'Present', note: '' },
  { id: 7, studentId: 'STU-007', studentName: 'Ratha Kong', class: 'M1', date: '2026-06-09', status: 'Absent', note: 'Family issue' },
  { id: 8, studentId: 'STU-008', studentName: 'Maly Heng', class: 'M3', date: '2026-06-09', status: 'Present', note: '' },
]

export const mockActivities = [
  { id: 1, type: 'add', message: 'New student Bopha Nou enrolled in M1', time: '2 minutes ago', icon: 'student' },
  { id: 2, type: 'edit', message: 'Bunna Lim grade updated to 3.9 GPA', time: '1 hour ago', icon: 'edit' },
  { id: 3, type: 'absent', message: 'Dara Meas marked absent for M3', time: '3 hours ago', icon: 'absent' },
  { id: 4, type: 'class', message: 'M6 exam schedule updated', time: '5 hours ago', icon: 'class' },
  { id: 5, type: 'graduate', message: 'Maly Heng status changed to Graduated', time: '1 day ago', icon: 'graduate' },
]

export const classOptions = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6']
export const statusOptions = ['Active', 'Inactive', 'Graduated']
export const genderOptions = ['Male', 'Female']
