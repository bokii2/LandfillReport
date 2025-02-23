package mk.ukim.finki.landfillreport.repository;

import mk.ukim.finki.landfillreport.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository extends JpaRepository<Report, Long> {
}
