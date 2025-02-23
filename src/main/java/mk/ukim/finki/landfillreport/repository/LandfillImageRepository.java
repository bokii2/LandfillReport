package mk.ukim.finki.landfillreport.repository;

import mk.ukim.finki.landfillreport.models.LandfillImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LandfillImageRepository extends JpaRepository<LandfillImage, Long> {
}
