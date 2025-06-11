import RegisterForm from "@/components/auth/RegisterForm/RegisterForm";
// import { AuthRedirect } from "@/components/shared/AuthRedirect/AuthRedirect";

export default function Register() {
  return (
    <>
      {/* <AuthRedirect to="/home" condition="loggedIn" /> */}
      <RegisterForm />
    </>
  );
}
