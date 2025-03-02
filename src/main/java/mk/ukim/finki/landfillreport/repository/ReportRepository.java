package mk.ukim.finki.landfillreport.repository;

import mk.ukim.finki.landfillreport.models.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ReportRepository extends JpaRepository<Report, Long> {
    Optional<Report> findById(Long id);
}
