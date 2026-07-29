import ManageBookingsPage from "./pages/bookings/ManageBookingsPage";
import ScheduleMaintenancePage from "./pages/maintenance/ScheduleMaintenancePage";
import MyMaintenancePage from "./pages/maintenance/MyMaintenancePage";
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import HomePage from './pages/public/HomePage'
import LoginPage from './pages/public/LoginPage'
import RegisterPage from './pages/public/RegisterPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import EquipmentPage from './pages/equipment/EquipmentPage'
import SharingPage from './pages/sharing/SharingPage'
import MaintenancePage from './pages/maintenance/MaintenancePage'
import UsersPage from './pages/admin/UsersPage'
import LabPage from './pages/equipment/LabPage'
import NewBookingPage from "./pages/bookings/NewBookingPage";
import EquipmentDetailPage from "./pages/equipment/EquipmentDetailPage";
import MyBookingsPage from "./pages/bookings/MyBookingsPage";
import VerifyEmailPage from "./pages/public/VerifyEmailPage";
import ForgotPasswordPage from "./pages/public/ForgotPasswordPage";
import ResetPasswordPage from "./pages/public/ResetPasswordPage";
import AnalyticsDashboard from "./pages/analytics/AnalyticsDashboard";
import InvoiceListPage from "./pages/invoice/InvoiceListPage";
import CreateEquipmentPage from "./pages/equipment/CreateEquipmentPage";
import CreateInstitutionPage from "./pages/system-admin/CreateInstitutionPage";
import AvailableEquipmentPage from "./pages/sharing/AvailableEquipmentPage";
import IncomingRequestsPage from "./pages/sharing/IncomingRequestsPage";
import OutgoingRequestsPage from "./pages/sharing/OutgoingRequestsPage";
import SharingHistoryPage from "./pages/sharing/SharingHistoryPage";


function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Protected Routes - All authenticated users */}
        <Route path="/dashboard" element={
          <ProtectedRoute><DashboardPage /></ProtectedRoute>
        } />
        <Route
          path="/labs"
          element={
            <ProtectedRoute >    <LabPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sharing"
          element={
            <ProtectedRoute
              allowedRoles={[
                "INSTITUTION_ADMIN",
                "SYSTEM_ADMIN",
              ]}
            >
              <SharingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sharing/available"
          element={
            <ProtectedRoute
              allowedRoles={[
                "INSTITUTION_ADMIN",
                "SYSTEM_ADMIN",
              ]}
            >
              <AvailableEquipmentPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sharing/incoming"
          element={
            <ProtectedRoute
              allowedRoles={[
                "INSTITUTION_ADMIN",
                "SYSTEM_ADMIN",
              ]}
            >
              <IncomingRequestsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sharing/outgoing"
          element={
            <ProtectedRoute
              allowedRoles={[
                "INSTITUTION_ADMIN",
                "SYSTEM_ADMIN",
              ]}
            >
              <OutgoingRequestsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sharing/history"
          element={
            <ProtectedRoute
              allowedRoles={[
                "INSTITUTION_ADMIN",
                "SYSTEM_ADMIN",
              ]}
            >
              <SharingHistoryPage />
            </ProtectedRoute>
          }
        />


        <Route
          path="/equipment/create"
          element={
            <ProtectedRoute
              allowedRoles={[
                "LAB_MANAGER",
                "DEPARTMENT_HEAD",
                "INSTITUTION_ADMIN",
                "SYSTEM_ADMIN",
              ]}
            >
              <CreateEquipmentPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/institutions/create"
          element={
            <ProtectedRoute
              allowedRoles={["SYSTEM_ADMIN"]}
            >
              <CreateInstitutionPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/invoices"
          element={
            <ProtectedRoute>
              <InvoiceListPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute
              allowedRoles={[
                "LAB_MANAGER",
                "DEPARTMENT_HEAD",
                "INSTITUTION_ADMIN",
                "SYSTEM_ADMIN",
              ]}
            >
              <AnalyticsDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bookings"
          element={
            <ProtectedRoute
              allowedRoles={[
                "STUDENT",
                "PROFESSOR",
                "ASSOCIATE_PROFESSOR",
                "ASSISTANT_PROFESSOR",
                "RESEARCHER",
                "RESEARCH_ASSOCIATE",
                "RESEARCH_SCIENTIST",
              ]}>
              <MyBookingsPage />
            </ProtectedRoute>
          }
        />


        <Route
          path="/equipment/:labCode"
          element={
            <ProtectedRoute
              allowedRoles={[
                "STUDENT",
                "PROFESSOR",
                "ASSOCIATE_PROFESSOR",
                "ASSISTANT_PROFESSOR",
                "RESEARCHER",
                "RESEARCH_ASSOCIATE",
                "RESEARCH_SCIENTIST",
                "LAB_TECHNICIAN",
                "LAB_MANAGER",
                "DEPARTMENT_HEAD",
                "INSTITUTION_ADMIN",
                "SYSTEM_ADMIN",
              ]} >
              <EquipmentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/equipment/details/:equipmentCode"
          element={
            <ProtectedRoute
              allowedRoles={[
                "STUDENT",
                "PROFESSOR",
                "ASSOCIATE_PROFESSOR",
                "ASSISTANT_PROFESSOR",
                "RESEARCHER",
                "RESEARCH_ASSOCIATE",
                "RESEARCH_SCIENTIST",
                "LAB_TECHNICIAN",
                "LAB_MANAGER",
                "DEPARTMENT_HEAD",
                "INSTITUTION_ADMIN",
                "SYSTEM_ADMIN",
              ]}
            >
              <EquipmentDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bookings/new"
          element={
            <ProtectedRoute
              allowedRoles={[
                "STUDENT",
                "PROFESSOR",
                "ASSOCIATE_PROFESSOR",
                "ASSISTANT_PROFESSOR",
                "RESEARCHER",
                "RESEARCH_ASSOCIATE",
                "RESEARCH_SCIENTIST",
                "LAB_TECHNICIAN",
                "LAB_MANAGER",
                "DEPARTMENT_HEAD",
                "INSTITUTION_ADMIN",
                "SYSTEM_ADMIN",
              ]}
            >
              <NewBookingPage />
            </ProtectedRoute>
          }
        />


        <Route
          path="/bookings/manage"
          element={
            <ProtectedRoute allowedRoles={["LAB_MANAGER"]}>
              <ManageBookingsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/maintenance/new"
          element={
            <ProtectedRoute
              allowedRoles={[
                "LAB_MANAGER",
                "SYSTEM_ADMIN",
              ]}
            >
              <ScheduleMaintenancePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-maintenance"
          element={
            <ProtectedRoute
              allowedRoles={["LAB_TECHNICIAN"]}
            >
              <MyMaintenancePage />
            </ProtectedRoute>
          }
        />

        <Route path="/maintenance" element={
          <ProtectedRoute allowedRoles={['LAB_TECHNICIAN', 'LAB_MANAGER', 'DEPARTMENT_HEAD', 'INSTITUTION_ADMIN', 'SYSTEM_ADMIN']}>
            <MaintenancePage />
          </ProtectedRoute>
        } />

        {/* Protected Routes - Admins only */}
        <Route path="/users" element={
          <ProtectedRoute allowedRoles={['INSTITUTION_ADMIN', 'SYSTEM_ADMIN']}>
            <UsersPage />
          </ProtectedRoute>
        } />

      </Routes>
    </AuthProvider>
  )
}

export default App
