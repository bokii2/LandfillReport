import { ILandfillImage } from "./LandfillImage.type";
import { ILocation } from "./Location.type";

export interface IReport {
    id: number;
    description: string;
    createdAt?: string;
    status: string;
    location: ILocation;
    image: ILandfillImage;
    createdBy: string;
}

export interface IReportList {
    reports: IReport[];
}