package mk.ukim.finki.landfillreport.controller;

import mk.ukim.finki.landfillreport.models.LandfillImage;
import mk.ukim.finki.landfillreport.models.Location;
import mk.ukim.finki.landfillreport.models.Report;
import mk.ukim.finki.landfillreport.models.Status;
import mk.ukim.finki.landfillreport.service.LandfillImageService;
import mk.ukim.finki.landfillreport.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Controller
public class ReportController {
    private final ReportService reportService;
    private final LandfillImageService imageService;

    @Autowired
    public ReportController(ReportService reportService, LandfillImageService imageService){
        this.reportService = reportService;
        this.imageService = imageService;
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
                               @RequestParam("images") MultipartFile[] images) throws IOException {
        Report report = new Report();
        report.setDescription(description);
        report.setLocation(new Location(latitude, longitude));

        List<LandfillImage> landfillImages = new ArrayList<>();
        for (MultipartFile image : images) {
            LandfillImage uploadedImage = imageService.uploadImage(image);
            uploadedImage.setReport(report);
            landfillImages.add(uploadedImage);
        }
        report.setImages(landfillImages);

        reportService.saveReport(report);
        return "redirect:/home";
    }

    @GetMapping("/image/{id}")
    public ResponseEntity<byte[]> getImage(@PathVariable Long id) {
        Optional<LandfillImage> imageOptional = imageService.getImageById(id);

        if (imageOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        LandfillImage image = imageOptional.get();
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(image.getImageData());
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
