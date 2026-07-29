export const ROLES = {
  STUDENT: "STUDENT",

  PROFESSOR: "PROFESSOR",
  ASSOCIATE_PROFESSOR: "ASSOCIATE_PROFESSOR",
  ASSISTANT_PROFESSOR: "ASSISTANT_PROFESSOR",

  RESEARCHER: "RESEARCHER",
  RESEARCH_ASSOCIATE: "RESEARCH_ASSOCIATE",
  RESEARCH_SCIENTIST: "RESEARCH_SCIENTIST",

  LAB_TECHNICIAN: "LAB_TECHNICIAN",
  LAB_MANAGER: "LAB_MANAGER",

  DEPARTMENT_HEAD: "DEPARTMENT_HEAD",

  INSTITUTION_ADMIN: "INSTITUTION_ADMIN",
  SYSTEM_ADMIN: "SYSTEM_ADMIN",
};

export const ROLE_LABELS = {
  [ROLES.STUDENT]: "Student",

  [ROLES.PROFESSOR]: "Professor",
  [ROLES.ASSOCIATE_PROFESSOR]: "Associate Professor",
  [ROLES.ASSISTANT_PROFESSOR]: "Assistant Professor",

  [ROLES.RESEARCHER]: "Researcher",
  [ROLES.RESEARCH_ASSOCIATE]: "Research Associate",
  [ROLES.RESEARCH_SCIENTIST]: "Research Scientist",

  [ROLES.LAB_TECHNICIAN]: "Lab Technician",
  [ROLES.LAB_MANAGER]: "Lab Manager",

  [ROLES.DEPARTMENT_HEAD]: "Department Head",

  [ROLES.INSTITUTION_ADMIN]: "Institution Admin",
  [ROLES.SYSTEM_ADMIN]: "System Admin",
};

export const ROLE_COLORS = {
  [ROLES.STUDENT]: "blue",

  [ROLES.PROFESSOR]: "blue",
  [ROLES.ASSOCIATE_PROFESSOR]: "blue",
  [ROLES.ASSISTANT_PROFESSOR]: "blue",

  [ROLES.RESEARCHER]: "green",
  [ROLES.RESEARCH_ASSOCIATE]: "green",
  [ROLES.RESEARCH_SCIENTIST]: "green",

  [ROLES.LAB_TECHNICIAN]: "amber",
  [ROLES.LAB_MANAGER]: "green",

  [ROLES.DEPARTMENT_HEAD]: "blue",

  [ROLES.INSTITUTION_ADMIN]: "purple",
  [ROLES.SYSTEM_ADMIN]: "red",
};

export const hasRole = (userRole, allowedRoles) => {
  if (!allowedRoles || allowedRoles.length === 0) return true;
  return allowedRoles.includes(userRole);
};

export const getRoleNavItems = (role) => {
  const allNav = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "LayoutDashboard",
      roles: Object.values(ROLES),
    },
    {
      name: "Equipment",
      path: "/labs",
      icon: "Microscope",
      roles: Object.values(ROLES),
    },
    {
      name: "Inter-Institution",
      path: "/sharing",
      icon: "Share2",
      roles: [
        ROLES.INSTITUTION_ADMIN,
        ROLES.SYSTEM_ADMIN,
      ],
      children: [
        {
          name: "Dashboard",
          path: "/sharing",
        },
        {
          name: "Available Equipment",
          path: "/sharing/available",
        },
        {
          name: "Incoming Requests",
          path: "/sharing/incoming",
        },
        {
          name: "Outgoing Requests",
          path: "/sharing/outgoing",
        },
        {
          name: "History",
          path: "/sharing/history",
        },
      ],
    },
    {
      name: "Maintenance",
      path: "/maintenance",
      icon: "Wrench",
      roles: [
        ROLES.LAB_TECHNICIAN,
        ROLES.LAB_MANAGER,
        ROLES.DEPARTMENT_HEAD,
        ROLES.INSTITUTION_ADMIN,
        ROLES.SYSTEM_ADMIN,
      ],
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: "BarChart3",
      roles: [
        ROLES.LAB_MANAGER,
        ROLES.DEPARTMENT_HEAD,
        ROLES.INSTITUTION_ADMIN,
        ROLES.SYSTEM_ADMIN,
      ],
    },
    {
      name: "Invoices",
      path: "/invoices",
      icon: "Receipt",
      roles: Object.values(ROLES),
    },
    {
      name: "Users",
      path: "/users",
      icon: "Users",
      roles: [
        ROLES.INSTITUTION_ADMIN,
        ROLES.SYSTEM_ADMIN,
      ],
    },
  ];

  return allNav.filter((item) => item.roles.includes(role));
};

export const getRoleQuickActions = () => {
  return [];
};