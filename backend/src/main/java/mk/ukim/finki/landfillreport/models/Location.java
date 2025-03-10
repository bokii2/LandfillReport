package mk.ukim.finki.landfillreport.models;

import jakarta.persistence.*;
import lombok.*;

@Table(name = "location")
@Data
@Entity
@Getter
@Setter
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @OneToOne(mappedBy = "location", cascade = CascadeType.PERSIST)
    @ToString.Exclude
    private Report report;

    public Location(){

    }

    public Location(Double latitude, Double longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }
}
