# LRUP — Lab Resource Utilization Platform

A full-stack platform that lets research institutions, universities, and laboratories share expensive lab equipment, manage bookings, track maintenance, and monitor utilization — all from one role-aware dashboard.

> Built with a Spring Boot backend and a React frontend, LRUP replaces spreadsheets and email chains with a real inventory, booking, and inter-institution sharing system for shared scientific equipment.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [User Roles](#user-roles)
- [Data Model](#data-model)
- [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Backend Setup](#backend-setup)
    - [Frontend Setup](#frontend-setup)
    - [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Design System](#design-system)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Academic and research institutions often own equipment — microscopes, spectrometers, centrifuges — that sits idle most of the week while another department or a partner institution could be using it. LRUP centralizes that equipment into a searchable inventory, lets students and researchers book time on it, gives lab managers and technicians tools to track maintenance and status, and lets institutions share equipment with each other instead of duplicating purchases.

## Key Features

**Equipment & Labs**
- Searchable equipment inventory with status tracking (Available, In Use, Under Maintenance, Out of Service)
- Equipment detail pages with specs, service history, and next-service countdown
- Lab creation and browsing, scoped by institution and department

**Bookings**
- Book equipment for a date/time range with live cost estimation
- Manager approval workflow for pending booking requests
- Cancel bookings, view booking history

**Maintenance**
- Schedule preventive, corrective, and calibration maintenance
- Technician workflow: start → complete, with status tracking
- Service interval and "days until next service" tracking per equipment

**Inter-Institution Sharing**
- Browse equipment available from partner institutions
- Submit, approve, reject, and cancel sharing requests
- Full sharing history with search and status filters

**Analytics & Reporting**
- Role-scoped analytics (system-wide, per-institution, per-lab)
- Booking trends, revenue by equipment, top equipment, weekly utilization, waiting-queue analytics

**Accounts & Access**
- Email/password auth plus Google and GitHub OAuth
- Email verification via OTP, forgot/reset password flow
- Twelve distinct user roles, each with a tailored dashboard and permissions

**Everything Else**
- In-app notifications with read/unread state
- Invoicing and billing history
- Equipment sharing waitlists
- Platform-wide settings (booking limits, feature toggles, notification preferences)

## Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS
- React Router
- Axios / React Query–style data hooks
- Recharts (analytics charts)
- react-hot-toast (notifications)

**Backend**
- Spring Boot
- Spring Security with JWT authentication
- JPA / Hibernate
- Redis (caching)

## User Roles

| Role | Typical Access |
|---|---|
| System Admin | Full platform control across all institutions |
| Institution Admin | Manage users, equipment, and analytics for their institution |
| Department Head | Department-level analytics and oversight |
| Lab Manager | Approve bookings, manage equipment and maintenance for their lab |
| Lab Technician | Perform and update maintenance tasks |
| Professor / Associate Professor / Assistant Professor | Book equipment, view schedules |
| Research Scientist / Research Associate / Researcher | Book equipment, request inter-institution sharing |
| Student | Book equipment, view personal bookings and queue position |

## Data Model

Core entities: **Institution, Department, User, Equipment, Booking, Waitlist, Utilization Log, Maintenance Record, Resource Sharing, Notification, Billing**.

At a glance: an **Institution** has many **Departments**, each with **Users** and **Labs**. Labs hold **Equipment**, which can be **Booked** (with a **Waitlist** when unavailable), tracked in **Utilization Logs**, serviced via **Maintenance Records**, or offered to other institutions through **Resource Sharing**. Bookings and maintenance generate **Notifications** and **Billing** records.

## Getting Started

### Prerequisites

- Java 17+ and Maven (or your build tool of choice) for the backend
- Node.js 18+ and npm for the frontend
- A running database (PostgreSQL/MySQL, per your `application.yml`)
- Redis (for caching, if enabled)

> Adjust the commands below to match your actual project scripts — these follow standard Spring Boot + Vite conventions.

### Backend Setup

```bash
cd backend
# configure src/main/resources/application.yml (DB credentials, JWT secret, mail settings)
./mvnw spring-boot:run
```

The API should start on `http://localhost:8080` by default.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app should start on `http://localhost:3000` (or the port Vite reports).

### Environment Variables

Create a `.env` file in the frontend root:

```env
VITE_API_BASE_URL=http://localhost:8080
```

This is required for equipment images and any other backend-served assets to resolve correctly — without it, image and API requests will silently hit the frontend's own origin instead of the backend.

Backend environment variables (in `application.yml` or your secrets manager) typically include:

```yaml
JWT_SECRET=your-secret-key
DB_URL=jdbc:postgresql://localhost:5432/lrup
DB_USERNAME=your-db-user
DB_PASSWORD=your-db-password
MAIL_USERNAME=your-smtp-user       # for OTP emails
MAIL_PASSWORD=your-smtp-password
GOOGLE_CLIENT_ID=...               # for Google OAuth
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...               # for GitHub OAuth
GITHUB_CLIENT_SECRET=...
```

## Project Structure

```
frontend/
  src/
    components/
      auth/          # ProtectedRoute, RoleGuard
      common/         # StatCard, StatusBadge, LoadingSpinner, EmptyState, WeeklyUtilizationChart
      layout/         # DashboardLayout, PublicLayout
    context/          # AuthContext
    dashboard/        # Role-specific dashboards (Student, LabManager, SystemAdmin, ...)
    hooks/             # useAuth, useBookings, useEquipment, useDashboard, useAnalytics, ...
    pages/             # Route-level pages (equipment, bookings, maintenance, sharing, ...)
    services/          # API clients (authService, dashboardService, ...)
    utils/              # roles, helpers

backend/
  src/main/java/...
    controller/         # REST endpoints
    service/            # Business logic
    repository/          # JPA repositories
    entity/               # Domain entities
    security/              # JWT filter, Spring Security config
    dto/                    # Request/response models
```

## Design System

The frontend uses a consistent "instrument panel" visual identity across every page — bordered hairline cards, monospace labels and data, and a restrained accent palette rather than default framework colors:

| Token | Hex | Use |
|---|---|---|
| Ink | `#14181C` | Primary dark surface / text |
| Paper | `#F6F5F1` | Primary light surface |
| Steel | `#5B6770` | Secondary text / borders |
| Amber | `#E8A33D` | Primary accent — attention, pending, maintenance |
| Teal | `#1F7A6C` | Secondary accent — positive, active, approved |
| Line | `#D8D3C7` | Hairline borders |

Shared components (`StatCard`, `StatusBadge`, `LoadingSpinner`, `EmptyState`, `WeeklyUtilizationChart`) live in `components/common/` and are used consistently across every dashboard and page rather than each screen reinventing its own version.

## Roadmap

- [ ] Finish wiring remaining frontend pages to the live Spring Boot API
- [ ] Push notifications and email digest for booking approvals
- [ ] Equipment QR code scanning for check-in/check-out
- [ ] Cost-sharing calculator for inter-institution agreements
- [ ] Exportable analytics reports (PDF/Excel)

## Contributing

This is currently a solo/portfolio project. If you'd like to suggest a change, open an issue describing the bug or feature before submitting a pull request.

## License

Specify your license here (e.g. MIT) — none is currently declared.

---

Built by [Utkarsh](https://github.com/Its-Utkarsh1) · [LinkedIn](https://linkedin.com/in/sriutkarsh)
