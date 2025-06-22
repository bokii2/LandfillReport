package mk.ukim.finki.landfillreport.repository;

import mk.ukim.finki.landfillreport.models.Prediction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PredictionRepository extends JpaRepository<Prediction, Long> {
}
