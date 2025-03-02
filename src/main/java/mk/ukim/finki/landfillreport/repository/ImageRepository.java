package mk.ukim.finki.landfillreport.repository;

import mk.ukim.finki.landfillreport.models.LandfillImage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ImageRepository extends JpaRepository<LandfillImage, Long> {
    Optional<LandfillImage> findByName(String name);
    Optional<LandfillImage> findById(Long id);
}
