package mk.ukim.finki.landfillreport.web;

import mk.ukim.finki.landfillreport.models.Prediction;
import mk.ukim.finki.landfillreport.service.PredictionService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/predictions")
public class PredictionApiController {

    private final PredictionService predictionService;

    public PredictionApiController(PredictionService predictionService) {
        this.predictionService = predictionService;
    }

    @GetMapping("/generate")
    public List<Prediction> generatePredictions() {
        return predictionService.predictNextLandfills();
    }

    @GetMapping
    public List<Prediction> getAllPredictions() {
        return predictionService.getAllPredictions();
    }
}