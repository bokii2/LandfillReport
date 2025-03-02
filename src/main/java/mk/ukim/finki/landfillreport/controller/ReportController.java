package mk.ukim.finki.landfillreport.controller;

import mk.ukim.finki.landfillreport.models.LandfillImage;
import mk.ukim.finki.landfillreport.models.Location;
import mk.ukim.finki.landfillreport.models.Report;
import mk.ukim.finki.landfillreport.models.Status;
import mk.ukim.finki.landfillreport.service.LandfillImageService;
import mk.ukim.finki.landfillreport.service.LocationService;
import mk.ukim.finki.landfillreport.service.ReportService;
import mk.ukim.finki.landfillreport.util.ImageUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Controller
public class ReportController {
    private final ReportService reportService;
    private final LandfillImageService imageService;
    private final LocationService locationService;

    @Autowired
    public ReportController(ReportService reportService, LandfillImageService imageService, LocationService locationService){
        this.reportService = reportService;
        this.imageService = imageService;
        this.locationService = locationService;
    }

    @GetMapping("/reports")
    public String viewReports(Model model) {
        List<Report> reports = reportService.getAllReports();
        model.addAttribute("reports", reports);
        return "reports";
    }

    @GetMapping("/report/{id}")
    public String viewReportDetails(@PathVariable String id, Model model) {
        Long reportId = Long.parseLong(id);
        Report report = reportService.getReportById(reportId);
        model.addAttribute("report", report);
        return "report-details";
    }

    @GetMapping("/send-report")
    public String sendReportForm() {
        return "send-report";
    }

    @PostMapping("/send-report")
    public String submitReport(@RequestParam("description") String description,
                               @RequestParam("latitude") Double latitude,
                               @RequestParam("longitude") Double longitude,
                               @RequestParam("image") MultipartFile image) throws IOException {
        Location newLocation = new Location(latitude, longitude);
        locationService.saveLocation(newLocation);

        LandfillImage img = new LandfillImage(image.getOriginalFilename(),
                image.getContentType(),
                ImageUtils.compressImage(image.getBytes()));
        imageService.saveImage(img);

        Report report = new Report();
        report.setLocation(newLocation);
        report.setDescription(description);
        report.setImage(img);

        reportService.saveReport(report);
        return "redirect:/reports";
    }

    @GetMapping("/image/{id}")
    public ResponseEntity<byte[]> getImage(@PathVariable("id") Long id) throws IOException {
        Optional<LandfillImage> dbImage = imageService.getImageById(id);
        if (dbImage.isPresent()) {
            return ResponseEntity
                    .ok()
                    .contentType(MediaType.valueOf(dbImage.get().getType()))
                    .body(ImageUtils.decompressImage(dbImage.get().getImageData()));
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/report/{id}/update-status")
    public String updateReportStatus(@PathVariable String id, @RequestParam String status) {
        Long reportId = Long.parseLong(id);
        Status s;
        if(status.equals("APPROVED"))
            s = Status.APPROVED;
        else
            s = Status.REJECTED;
        reportService.updateReportStatus(reportId, s);
        return "redirect:/reports";
    }
}
