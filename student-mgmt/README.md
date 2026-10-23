# EduManage — Student Management System

A modern admin dashboard built with React.js (Vite) + Tailwind CSS + React Router DOM.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open http://localhost:5173
```

## Login Credentials

- **Email:** admin@school.edu
- **Password:** admin123

## Features

| Page | Description |
|------|-------------|
| **Login** | Auth with show/hide password |
| **Dashboard** | Stats, recent students, activity feed, class overview |
| **Students** | Table + card view, add/edit/delete modals, search, filter, pagination |
| **Student Details** | Full profile with GPA grade badge |
| **Classes** | All classes with teacher, room, schedule info |
| **Attendance** | Daily attendance by date and class |
| **Reports** | GPA distribution, class enrollment, status charts |
| **Settings** | School info, admin account, preferences |

## Tech Stack

- **React 18** + **Vite**
- **Tailwind CSS 3**
- **React Router DOM 6**
- **React Icons (Remix Icons)**
- Mock data (no backend required)

## Project Structure

```
src/
├── components/
│   ├── common/        Button, Input, Modal, Table
│   ├── layout/        Sidebar, Header
│   └── students/      StudentForm, StudentTable, StudentCard
├── pages/             Login, Dashboard, Students, StudentDetails,
│                      Classes, Attendance, Reports, Settings
├── routes/            AppRoutes (protected layout)
├── services/          api.js (mock service layer)
└── data/              mockData.js
```
