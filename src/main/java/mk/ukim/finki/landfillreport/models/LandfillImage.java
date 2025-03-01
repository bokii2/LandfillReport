package mk.ukim.finki.landfillreport.models;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import jakarta.persistence.*;
import lombok.*;


@Data
@Entity
@Builder
public class LandfillImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String type;

    @Lob
    @Column(name = "image_data",length = 1000)
    private byte[] imageData;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "report_id", nullable = true)
    private Report report;

    public LandfillImage(String name, String type, byte[] imageData) {
        this.name = name;
        this.type = type;
        this.imageData = imageData;
    }

    public LandfillImage() {
    }

    public void setReport(Report report) {
        this.report = report;
    }

    public byte[] getImageData() {
        return imageData;
    }

    public Report getReport() {
        return report;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setImageData(byte[] imageData) {
        this.imageData = imageData;
    }

    public String getName() {
        return name;
    }

    public String getType() {
        return type;
    }

    public Long getId() {
        return id;
    }
}
