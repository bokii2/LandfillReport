package mk.ukim.finki.landfillreport.service;

import jakarta.transaction.Transactional;
import mk.ukim.finki.landfillreport.models.LandfillImage;
import mk.ukim.finki.landfillreport.models.Location;
import mk.ukim.finki.landfillreport.models.Report;
import mk.ukim.finki.landfillreport.models.Status;
import mk.ukim.finki.landfillreport.repository.ImageRepository;
import mk.ukim.finki.landfillreport.repository.LocationRepository;
import mk.ukim.finki.landfillreport.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ReportService {
    private ReportRepository reportRepository;
    private LocationRepository locationRepository;
    private ImageRepository imageRepository;

    @Autowired
    public ReportService(ReportRepository reportRepository, LocationRepository locationRepository, ImageRepository imageRepository) {
        this.reportRepository = reportRepository;
        this.locationRepository = locationRepository;
        this.imageRepository = imageRepository;
    }

    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }

    public Report getReportById(Long id) {
        return reportRepository.findById(id).orElseThrow(() -> new RuntimeException("Report not found"));
    }

    public void saveReport(Report report) {
        reportRepository.save(report);
    }

    public void updateReportStatus(Long id, Status status) {
        Report report = getReportById(id);
        report.setStatus(status);
        reportRepository.save(report);
    }

    public List<Report> filterByStatus(Status status) {
        if(status.equals(Status.PENDING))
            return reportRepository.findByStatus(Status.PENDING);
        else if (status.equals(Status.APPROVED))
            return reportRepository.findByStatus(Status.APPROVED);
        else if (status.equals(Status.REJECTED))
            return reportRepository.findByStatus(Status.REJECTED);
        else
            return reportRepository.findAll();
    }
}
