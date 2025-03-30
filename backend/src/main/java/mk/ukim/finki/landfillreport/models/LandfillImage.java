package mk.ukim.finki.landfillreport.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.Builder;

@Data
@Entity
@Getter
@Setter
@Builder
public class LandfillImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String type;

    @Column(name = "image_data", nullable = false, length = 100000)
    private byte[] imageData;

    @OneToOne(mappedBy = "image", cascade = CascadeType.PERSIST)
    @JsonIgnore
    private Report report;

    public LandfillImage(String name, String type, byte[] imageData) {
        this.name = name;
        this.type = type;
        this.imageData = imageData;
    }

    public LandfillImage(Long id, String name, String type, byte[] imageData, Report report) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.imageData = imageData;
        this.report = report;
    }

    public LandfillImage() {
    }
}
