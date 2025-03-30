package mk.ukim.finki.landfillreport.controller;

import mk.ukim.finki.landfillreport.models.*;
import mk.ukim.finki.landfillreport.service.CustomUserDetailsService;
import mk.ukim.finki.landfillreport.service.LandfillImageService;
import mk.ukim.finki.landfillreport.service.LocationService;
import mk.ukim.finki.landfillreport.service.ReportService;
import mk.ukim.finki.landfillreport.util.ImageUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", allowCredentials = "true")
@RestController
@RequestMapping("/api/reports")
public class ReportApiController {
    private final ReportService reportService;
    private final LandfillImageService imageService;
    private final LocationService locationService;
    private final CustomUserDetailsService userService;

    @Autowired
    public ReportApiController(ReportService reportService, LandfillImageService imageService,
                            LocationService locationService, CustomUserDetailsService userService) {
        this.reportService = reportService;
        this.imageService = imageService;
        this.locationService = locationService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<Report>> getAllReports(@RequestParam(required = false) String status) {
        List<Report> reports;

        if (status == null || "ALL".equals(status)) {
            reports = reportService.getAllReports();
        } else {
            try {
                Status reportStatus = Status.valueOf(status.toUpperCase());
                reports = reportService.filterByStatus(reportStatus);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().build();
            }
        }

        return ResponseEntity.ok(reports);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Report> getReportById(@PathVariable Long id) {
        try {
            Report report = reportService.getReportById(id);
            return ResponseEntity.ok(report);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createReport(@RequestParam("description") String description,
                                          @RequestParam("latitude") Double latitude,
                                          @RequestParam("longitude") Double longitude,
                                          @RequestParam("image") MultipartFile image) {
        try {
            // Create and save location
            Location newLocation = new Location(latitude, longitude);
            locationService.saveLocation(newLocation);

            // Create and save image
            LandfillImage img = new LandfillImage(image.getOriginalFilename(),
                    image.getContentType(),
                    ImageUtils.compressImage(image.getBytes()));
            imageService.saveImage(img);

            // Create report
            Report report = new Report();
            report.setLocation(newLocation);
            report.setDescription(description);
            report.setImage(img);
            report.setStatus(Status.PENDING); // Default status

            // Set user from authentication
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            UserProfile user = userService.findUserByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            report.setUser(user);

            // Save report
            reportService.saveReport(report);

            return ResponseEntity.status(HttpStatus.CREATED).body(report);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing image: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error creating report: " + e.getMessage());
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateReportStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            Status newStatus;
            try {
                newStatus = Status.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body("Invalid status value");
            }

            reportService.updateReportStatus(id, newStatus);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Report not found with id: " + id);
        }
    }

    @GetMapping("/image/{id}")
    public ResponseEntity<byte[]> getImage(@PathVariable Long id) {
        Optional<LandfillImage> dbImage = imageService.getImageById(id);
        return dbImage.map(landfillImage -> ResponseEntity
                .ok()
                .contentType(MediaType.valueOf(landfillImage.getType()))
                .body(ImageUtils.decompressImage(landfillImage.getImageData()))).orElseGet(() -> ResponseEntity.notFound().build());
    }
}