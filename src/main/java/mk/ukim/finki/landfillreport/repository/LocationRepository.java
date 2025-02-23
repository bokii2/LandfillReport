package mk.ukim.finki.landfillreport.repository;

import mk.ukim.finki.landfillreport.models.Location;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LocationRepository extends JpaRepository<Location, Long> {
}
