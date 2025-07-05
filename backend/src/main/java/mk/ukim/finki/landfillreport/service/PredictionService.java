package mk.ukim.finki.landfillreport.service;

import mk.ukim.finki.landfillreport.models.Prediction;

import java.util.List;

public interface PredictionService {
    List<Prediction> predictNextLandfills();
    List<Prediction> getAllPredictions();
}
