package mk.ukim.finki.landfillreport.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Table(name = "report")
@Getter
@Setter
@Data
@Entity
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    @OneToOne(optional = false)
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;

    @OneToOne(optional = false)
    @JoinColumn(name = "image_id", nullable = false)
    private LandfillImage image;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    private UserProfile user;

    public Report() {
    }

    public Report(String description, Location location) {
        this.description = description;
        this.location = location;
    }

    public Report(String description, Location location, LandfillImage image) {
        this.description = description;
        this.location = location;
        this.image = image;
    }
}
