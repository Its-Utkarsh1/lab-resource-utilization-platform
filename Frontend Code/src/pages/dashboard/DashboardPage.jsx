import React from "react";

import { useAuth } from "../../hooks/useAuth";

import DashboardLayout from "../../components/layout/DashboardLayout";

import UserDashboard from "../../dashboard/UserDashboard";

import LabManagerDashboard from "../../dashboard/LabManagerDashboard";

import LabTechnicianDashboard from "../../dashboard/LabTechnicianDashboard";

import DepartmentHeadDashboard from "../../dashboard/DepartmentHeadDashboard";

import InstitutionAdminDashboard from "../../dashboard/InstitutionAdminDashboard";

import SystemAdminDashboard from "../../dashboard/SystemAdminDashboard";



const DashboardPage = () => {

  const { user } = useAuth();

console.log("Current User:", user);
  console.log("Current Role:", user?.role);

  const renderDashboard = () => {

    switch (user?.role) {

      case "STUDENT":
      case "PROFESSOR":
      case "ASSOCIATE_PROFESSOR":
      case "ASSISTANT_PROFESSOR":
      case "RESEARCHER":
      case "RESEARCH_ASSOCIATE":
      case "RESEARCH_SCIENTIST":
        return <UserDashboard />



      case "LAB_TECHNICIAN":

        return <LabTechnicianDashboard />;



      case "LAB_MANAGER":

        return <LabManagerDashboard />;



      case "DEPARTMENT_HEAD":

        return <DepartmentHeadDashboard />;



      case "INSTITUTION_ADMIN":

        return <InstitutionAdminDashboard />;



      case "SYSTEM_ADMIN":

        return <SystemAdminDashboard />;



      default:

        return (

          <div className="p-10 text-center">

            <h2 className="text-2xl font-bold">Unauthorized</h2>

          </div>

        );

    }

  };



  return (

    <DashboardLayout>

      {renderDashboard()}

    </DashboardLayout>

  );

};



export default DashboardPage;