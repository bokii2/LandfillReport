import { AuthRedirect } from "@/components/shared/AuthRedirect/AuthRedirect";
import { ReportDetails } from "../../../components/report/ReportDetails/ReportDetails";

export default function ReportPage() {
  return (
    <>
      <AuthRedirect to="/login" condition="loggedOut" />
      <ReportDetails />
    </>
  );
}
