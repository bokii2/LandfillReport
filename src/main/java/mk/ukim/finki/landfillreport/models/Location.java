package mk.ukim.finki.landfillreport.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Table(name = "location")
@Data
@Entity
@Getter
@Setter
@NoArgsConstructor
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private double latitude;

    @Column(nullable = false)
    private double longitude;

    @OneToMany(mappedBy = "location", cascade = CascadeType.PERSIST)
    private List<Report> reports;
}
