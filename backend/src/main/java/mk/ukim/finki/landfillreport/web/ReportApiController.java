package mk.ukim.finki.landfillreport.web;

import mk.ukim.finki.landfillreport.models.*;
import mk.ukim.finki.landfillreport.service.impl.CustomUserDetailsServiceImpl;
import mk.ukim.finki.landfillreport.service.impl.LandfillImageServiceImpl;
import mk.ukim.finki.landfillreport.service.impl.LocationServiceImpl;
import mk.ukim.finki.landfillreport.service.impl.ReportServiceImpl;
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
    private final ReportServiceImpl reportServiceImpl;
    private final LandfillImageServiceImpl imageService;
    private final LocationServiceImpl locationServiceImpl;
    private final CustomUserDetailsServiceImpl userService;

    @Autowired
    public ReportApiController(ReportServiceImpl reportServiceImpl, LandfillImageServiceImpl imageService,
                               LocationServiceImpl locationServiceImpl, CustomUserDetailsServiceImpl userService) {
        this.reportServiceImpl = reportServiceImpl;
        this.imageService = imageService;
        this.locationServiceImpl = locationServiceImpl;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<Report>> getAllReports(@RequestParam(required = false) String status) {
        List<Report> reports;

        if (status == null || "ALL".equals(status)) {
            reports = reportServiceImpl.getAllReports();
        } else {
            try {
                Status reportStatus = Status.valueOf(status.toUpperCase());
                reports = reportServiceImpl.filterByStatus(reportStatus);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().build();
            }
        }

        return ResponseEntity.ok(reports);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReportDTO> getReportById(@PathVariable Long id) {
        try {
            Report report = reportServiceImpl.getReportById(id);
            return ResponseEntity.ok(new ReportDTO(report));
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
            report.setStatus(Status.PENDING);

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            UserProfile user = userService.findUserByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            report.setUser(user);

            reportServiceImpl.saveReport(report);

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

            reportServiceImpl.updateReportStatus(id, newStatus);
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