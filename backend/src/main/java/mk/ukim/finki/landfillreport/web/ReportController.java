package mk.ukim.finki.landfillreport.web;

import mk.ukim.finki.landfillreport.models.*;
import mk.ukim.finki.landfillreport.service.impl.CustomUserDetailsServiceImpl;
import mk.ukim.finki.landfillreport.service.impl.LandfillImageServiceImpl;
import mk.ukim.finki.landfillreport.service.impl.LocationServiceImpl;
import mk.ukim.finki.landfillreport.service.impl.ReportServiceImpl;
import mk.ukim.finki.landfillreport.util.ImageUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private final ReportServiceImpl reportServiceImpl;
    private final LandfillImageServiceImpl imageService;
    private final LocationServiceImpl locationServiceImpl;
    private final CustomUserDetailsServiceImpl userService;

    @Autowired
    public ReportController(ReportServiceImpl reportServiceImpl, LandfillImageServiceImpl imageService, LocationServiceImpl locationServiceImpl, CustomUserDetailsServiceImpl userService){
        this.reportServiceImpl = reportServiceImpl;
        this.imageService = imageService;
        this.locationServiceImpl = locationServiceImpl;
        this.userService = userService;
    }

    @GetMapping("/reports")
    public String viewReports(@RequestParam(required = false) String status, Model model) {
        List<Report> reports;

        if (status == null || "ALL".equals(status)) {
            reports = reportServiceImpl.getAllReports();
        } else {
            Status reportStatus = Status.valueOf(status.toUpperCase());
            reports = reportServiceImpl.filterByStatus(reportStatus);
        }

        model.addAttribute("reports", reports);
        model.addAttribute("reportsSize", reports.size());
        return "reports";
    }

    @GetMapping("/report/{id}")
    public String viewReportDetails(@PathVariable String id, Model model) {
        Long reportId = Long.parseLong(id);
        Report report = reportServiceImpl.getReportById(reportId);
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
        locationServiceImpl.saveLocation(newLocation);

        LandfillImage img = new LandfillImage(image.getOriginalFilename(),
                image.getContentType(),
                ImageUtils.compressImage(image.getBytes()));
        imageService.saveImage(img);

        Report report = new Report();
        report.setLocation(newLocation);
        report.setDescription(description);
        report.setImage(img);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        UserProfile user = userService.findUserByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        report.setUser(user);

        reportServiceImpl.saveReport(report);
        return "redirect:/home";
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
        reportServiceImpl.updateReportStatus(reportId, s);
        return "redirect:/reports";
    }
}