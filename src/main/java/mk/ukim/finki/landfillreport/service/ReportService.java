package mk.ukim.finki.landfillreport.service;

import jakarta.transaction.Transactional;
import mk.ukim.finki.landfillreport.models.Location;
import mk.ukim.finki.landfillreport.models.Report;
import mk.ukim.finki.landfillreport.models.Status;
import mk.ukim.finki.landfillreport.repository.LocationRepository;
import mk.ukim.finki.landfillreport.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
    public Report saveReport(Report report) {
        if (report.getLocation() != null) {
            Location location = report.getLocation();

            Optional<Location> existingLocation = locationRepository.findByLatitudeAndLongitude(location.getLatitude(), location.getLongitude());

            if (existingLocation.isPresent()) {
                report.setLocation(existingLocation.get());
            } else {
                location = locationRepository.save(location);
                report.setLocation(location);
            }
        }

        return reportRepository.save(report);
    }

    public void updateReportStatus(Long id, Status status) {
        Report report = getReportById(id);
        report.setStatus(status);
        reportRepository.save(report);
    }
}
