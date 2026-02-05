"use client";

import { AuthRedirect } from "@/components/shared/AuthRedirect/AuthRedirect";
import { MyReportsList } from "@/components/report/MyReportsList/MyReportsList";

export default function MyReports() {
  return (
    <>
      <AuthRedirect to="/login" condition="loggedOut" />
      <MyReportsList />
    </>
  );
}
