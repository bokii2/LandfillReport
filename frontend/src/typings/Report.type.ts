import { ILandfillImage } from "./LandfillImage.type";
import { ILocation } from "./Location.type";
import { IUserProfile } from "./UserProfile.type";

export interface IReport {
    id: number;
    description: string;
    createdAt: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    location: ILocation;
    image: ILandfillImage;
    user: IUserProfile;
}

export interface IReportList {
    reports: IReport[];
}