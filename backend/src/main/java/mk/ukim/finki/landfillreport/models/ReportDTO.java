package mk.ukim.finki.landfillreport.models;

import lombok.Data;
import mk.ukim.finki.landfillreport.util.ImageUtils;

import java.time.LocalDateTime;
import java.util.Base64;

@Data
public class ReportDTO {
    private Long id;
    private String description;
    private LocalDateTime createdAt;
    private Status status;
    private Location location;
    private String imageBase64;
    private String imageType;
    private String createdBy;

    public ReportDTO(mk.ukim.finki.landfillreport.models.Report report) {
        this.id = report.getId();
        this.description = report.getDescription();
        this.createdAt = report.getCreatedAt();
        this.status = report.getStatus();
        this.location = report.getLocation();
        this.createdBy = report.getUser().getUsername();

        if (report.getImage() != null && report.getImage().getImageData() != null) {
            byte[] decompressed = ImageUtils.decompressImage(report.getImage().getImageData());
            this.imageBase64 = Base64.getEncoder().encodeToString(decompressed);
            this.imageType = report.getImage().getType();
        }
    }
}