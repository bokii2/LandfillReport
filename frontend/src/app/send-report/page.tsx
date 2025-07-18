"use client";

import React from "react";
import { ReportForm } from "@/components/report/ReportForm/ReportForm";
import { AuthRedirect } from "@/components/shared/AuthRedirect/AuthRedirect";

export default function SendReport() {
  return (
    <>
      <AuthRedirect to="/login" condition="loggedOut" />
      <ReportForm />
    </>
  );
}
