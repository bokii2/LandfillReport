package mk.ukim.finki.landfillreport.service;

import mk.ukim.finki.landfillreport.models.Report;
import mk.ukim.finki.landfillreport.models.Status;

import java.util.List;

public interface ReportService {
    List<Report> getAllReports();
    Report getReportById(Long id);
    void saveReport(Report report);
    void updateReportStatus(Long id, Status status);
    List<Report> filterByStatus(Status status);
}
