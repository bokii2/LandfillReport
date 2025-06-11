import { AuthRedirect } from "@/components/shared/AuthRedirect/AuthRedirect";
import LoginClientWrapper from "./login-client";

export default function Login() {
  return (
    <>
      <AuthRedirect to="/home" condition="loggedIn" />
      <LoginClientWrapper />
    </>
  );
}
