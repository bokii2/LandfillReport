package mk.ukim.finki.landfillreport.controller;

import mk.ukim.finki.landfillreport.models.Location;
import mk.ukim.finki.landfillreport.models.Report;
import mk.ukim.finki.landfillreport.models.Status;
import mk.ukim.finki.landfillreport.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
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
import java.util.UUID;

@Controller
public class ReportController {
    private final ReportService reportService;

    @Autowired
    public ReportController(ReportService reportService){
        this.reportService = reportService;
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
    public String submitReport(@ModelAttribute Report report,
                               @RequestParam("latitude") Double latitude,
                               @RequestParam("longitude") Double longitude
                               /*@RequestParam("images") MultipartFile[] images*/) {

        report.setLocation(new Location(latitude, longitude));

        /*List<String> imagePaths = new ArrayList<>();

        String uploadDir = "uploads/landfill_images/";
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        for (MultipartFile image : images) {
            if (!image.isEmpty()) {
                try {
                    String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
                    Path filePath = Paths.get(uploadDir + fileName);

                    Files.write(filePath, image.getBytes());

                    imagePaths.add(filePath.toString());
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

        report.setImages(imagePaths);*/
        reportService.saveReport(report);
        return "redirect:/home";
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
