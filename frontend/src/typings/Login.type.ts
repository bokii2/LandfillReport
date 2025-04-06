export interface ILoginForm {
    username: string;
    password: string;
    invalidError?: string
}

export interface LoginRequest {
    username: string;
    password: string;
}
  
export interface LoginResponse {
    id: number;
    name: string;
    surname: string;
    username: string;
    email: string;
    role: "NORMAL_USER" | "ADMIN";
}