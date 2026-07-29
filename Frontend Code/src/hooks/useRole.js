import { useAuth } from './useAuth'
import { getRoleNavItems, hasRole } from "../utils/roles";
export const useRole = () => {
  const { user } = useAuth()
  const role = user?.role

  return {
    role,
    navItems: role ? getRoleNavItems(role) : [],
    quickActions: [],
    hasRole: (allowedRoles) => hasRole(role, allowedRoles),
    isAdmin: role === 'INSTITUTION_ADMIN' || role === 'SYSTEM_ADMIN',
    isManager: role === 'LAB_MANAGER' || role === 'DEPARTMENT_HEAD',
    isStaff: role === 'LAB_TECHNICIAN',
    isResearcher: role === 'RESEARCHER',
    isStudent: role === 'STUDENT',
  }
}
