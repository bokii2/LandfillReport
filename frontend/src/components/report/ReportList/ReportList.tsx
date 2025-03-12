import { IReport } from "@/typings/Report.type";

interface IReportListProps {
    report: IReport;
    
}

const reports: IReport[] = [
    { 
        id: 1, 
        description: "Illegal dumping in park", 
        location: { id: 1, latitude: 34.0522, longitude: -118.2437 }, 
        status: "PENDING", 
        createdAt: "2024-03-12T08:30:00Z",
        image: { id: 1, name: "dumping.jpg", type: "image/jpeg", imageData: "base64String" },
        user: { id: 1, name: "John", surname: "Doe" }
    },
    { 
        id: 2, 
        description: "Overflowing landfill", 
        location: { id: 2, latitude: 40.7128, longitude: -74.0060 }, 
        status: "APPROVED", 
        createdAt: "2024-03-11T10:15:00Z",
        image: { id: 2, name: "landfill.jpg", type: "image/png", imageData: "base64String" },
        user: { id: 2, name: "Alice", surname: "Smith" }
    }
];

export const ReportList = ({reportList}: IReportListProps) => {
    return (
        {reports.map((report) =>)}
    )
}