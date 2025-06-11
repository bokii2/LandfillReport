"use client";

import { ReportList } from "@/components/report/ReportList/ReportList";
import ProtectedRoute from "@/components/auth/ProtectedRoute/ProtectedRoute";
import { AuthRedirect } from "@/components/shared/AuthRedirect/AuthRedirect";

export default function Reports() {
  return (
    <ProtectedRoute adminOnly>
      <AuthRedirect to="/login" condition="loggedOut" />
      <ReportList />
    </ProtectedRoute>
  );
}
