package mk.ukim.finki.landfillreport.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Table(name = "report")
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

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    private UserProfile user;

    //@OneToMany(mappedBy = "report", cascade = CascadeType.ALL, orphanRemoval = true)
    @ElementCollection
    private List<String> images = new ArrayList<>();

    public Report() {
    }

    public Report(String description, Location location) {
        this.description = description;
        this.location = location;
    }

/*    public Report(String description, Location location, List<String> images) {
        this.description = description;
        this.location = location;
        this.images = images;
    }*/

    public void setDescription(String description) {
        this.description = description;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public void setUser(UserProfile user) {
        this.user = user;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }

    public Long getId() {
        return id;
    }

    public String getDescription() {
        return description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public Status getStatus() {
        return status;
    }

    public Location getLocation() {
        return location;
    }

    public UserProfile getUser() {
        return user;
    }

    public List<String> getImages() {
        return images;
    }
}
