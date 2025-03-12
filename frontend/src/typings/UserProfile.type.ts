import { IReport } from "./Report.type";

export interface IUserProfile {
    id: number;
    name: string;
    surname: string;
    username: string;
    email: string;
    role: "NORMAL_USER" | "ADMIN";
    reports: IReport[];
}