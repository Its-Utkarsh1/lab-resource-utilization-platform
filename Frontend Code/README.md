# LabResource Platform

A full-stack Laboratory Resource Utilization Platform built with React.js (frontend) and Spring Boot (backend).

## Features

- **Equipment Inventory Management** - Register, catalog, and track lab equipment
- **Smart Scheduling** - Rule-based booking with calendar views and waitlists
- **Real-time Utilization Monitoring** - Track usage with heatmaps and analytics
- **Inter-Institution Sharing** - Share equipment across institutions
- **Maintenance & Calibration** - Schedule and track maintenance workflows
- **Role-Based Access Control** - Tailored experiences for Students, Researchers, Technicians, Managers, and Admins
- **Analytics & Reporting** - Comprehensive dashboards and exportable reports

## Tech Stack

### Frontend
- React 18 + Vite
- React Router 6
- Tailwind CSS
- React Query (TanStack Query)
- Zustand (State Management)
- Recharts (Charts)
- React Hook Form
- Axios

### Backend (Required)
- Java Spring Boot
- Spring Security (JWT + OAuth2)
- Spring Data JPA
- PostgreSQL
- Redis (Caching)
- Apache Kafka (Messaging)

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Java 17+ (for backend)
- PostgreSQL (for backend)

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-org/lab-resource-platform.git
cd lab-resource-platform
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your backend API URL
```

4. Start the development server
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── common/         # Reusable UI components
│   └── layout/         # Layout components (PublicLayout, DashboardLayout)
├── context/            # React Context (AuthContext)
├── hooks/              # Custom React hooks
├── pages/              # Page components
│   ├── public/         # Public pages (Home, Login, Register)
│   ├── dashboard/      # Dashboard and notifications
│   ├── equipment/      # Equipment management
│   ├── bookings/       # Booking management
│   ├── analytics/      # Analytics and reports
│   ├── sharing/        # Inter-institution sharing
│   ├── maintenance/    # Maintenance workflows
│   └── admin/          # Admin pages (Users, Settings)
├── services/           # API service functions
├── styles/             # Global styles
├── utils/              # Utility functions
└── App.jsx             # Main app component with routing
```

## Role-Based Navigation

| Role | Accessible Pages |
|------|-----------------|
| Student | Dashboard, Equipment, Bookings |
| Researcher | Dashboard, Equipment, Bookings, Sharing |
| Lab Technician | Dashboard, Equipment, Bookings, Maintenance |
| Lab Manager | Dashboard, Equipment, Bookings, Analytics, Sharing, Maintenance |
| Department Head | Dashboard, Equipment, Bookings, Analytics, Sharing, Maintenance |
| Institution Admin | All above + Users Management |
| System Admin | Full access including Settings |

## API Integration

The frontend expects a Spring Boot backend running at `http://localhost:8080` with the following endpoints:

- `POST /api/auth/login` - JWT authentication
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `GET /api/equipment` - List equipment
- `GET /api/bookings` - List bookings
- `GET /api/analytics/dashboard-stats` - Dashboard statistics
- And more...

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - see LICENSE file for details
