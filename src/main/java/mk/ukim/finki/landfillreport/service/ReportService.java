package mk.ukim.finki.landfillreport.service;

import jakarta.transaction.Transactional;
import mk.ukim.finki.landfillreport.models.LandfillImage;
import mk.ukim.finki.landfillreport.models.Location;
import mk.ukim.finki.landfillreport.models.Report;
import mk.ukim.finki.landfillreport.models.Status;
import mk.ukim.finki.landfillreport.repository.LocationRepository;
import mk.ukim.finki.landfillreport.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ReportService {
    private ReportRepository reportRepository;
    private LocationRepository locationRepository;

    @Autowired
    public ReportService(ReportRepository reportRepository, LocationRepository locationRepository) {
        this.reportRepository = reportRepository;
        this.locationRepository = locationRepository;
    }

    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }

    public Report getReportById(Long id) {
        return reportRepository.findById(id).orElseThrow(() -> new RuntimeException("Report not found"));
    }

    @Transactional
    public void saveReport(Report report) {
        if (report.getLocation() != null) {
            Location location = report.getLocation();
            location = locationRepository.save(location);
            report.setLocation(location);
        }

        List<LandfillImage> images = new ArrayList<>();
        for (LandfillImage image : report.getImages()) {
            images.add(image);
        }
        report.setImages(images);

        reportRepository.save(report);
    }

    public void updateReportStatus(Long id, Status status) {
        Report report = getReportById(id);
        report.setStatus(status);
        reportRepository.save(report);
    }
}
