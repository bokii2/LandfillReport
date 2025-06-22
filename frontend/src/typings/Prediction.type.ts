import { ILocation } from "./Location.type";

export interface IPrediction {
    id: number;
    createdAt?: string;
    location: ILocation;
}

export interface IPredictionList {
    reports: IPrediction[];
}