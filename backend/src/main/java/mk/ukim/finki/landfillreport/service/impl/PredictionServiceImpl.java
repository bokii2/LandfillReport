package mk.ukim.finki.landfillreport.service.impl;

import mk.ukim.finki.landfillreport.models.Location;
import mk.ukim.finki.landfillreport.models.Prediction;
import mk.ukim.finki.landfillreport.models.Report;
import mk.ukim.finki.landfillreport.repository.LocationRepository;
import mk.ukim.finki.landfillreport.repository.PredictionRepository;
import mk.ukim.finki.landfillreport.repository.ReportRepository;
import mk.ukim.finki.landfillreport.service.PredictionService;
import org.springframework.stereotype.Service;
import smile.clustering.KMeans;

import java.util.ArrayList;
import java.util.List;

import static java.lang.Math.*;

@Service
public class PredictionServiceImpl implements PredictionService {

    private final ReportRepository reportRepository;
    private final LocationRepository locationRepository;
    private final PredictionRepository predictionRepository;

    public PredictionServiceImpl(ReportRepository reportRepository, LocationRepository locationRepository, PredictionRepository predictionRepository) {
        this.reportRepository = reportRepository;
        this.locationRepository = locationRepository;
        this.predictionRepository = predictionRepository;
    }

    private static final double DISTANCE_THRESHOLD_METERS = 50.0;

    private boolean isTooCloseToExistingReports(double lat, double lon, List<Report> reports) {
        for (Report report : reports) {
            Location loc = report.getLocation();
            double dist = haversine(lat, lon, loc.getLatitude(), loc.getLongitude());
            if (dist < DISTANCE_THRESHOLD_METERS) {
                return true;
            }
        }
        return false;
    }

    private double haversine(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371000; // Earth radius in meters
        double dLat = toRadians(lat2 - lat1);
        double dLon = toRadians(lon2 - lon1);
        double a = sin(dLat / 2) * sin(dLat / 2)
                + cos(toRadians(lat1)) * cos(toRadians(lat2))
                * sin(dLon / 2) * sin(dLon / 2);
        double c = 2 * atan2(sqrt(a), sqrt(1 - a));
        return R * c;
    }

    public List<Prediction> predictNextLandfills() {
        List<Report> allReports = reportRepository.findAll();

        if (allReports.size() < 3) {
            throw new IllegalStateException("Not enough reports to make predictions.");
        }

        double[][] coordinates = allReports.stream()
                .map(r -> new double[]{
                        r.getLocation().getLatitude(),
                        r.getLocation().getLongitude()
                })
                .toArray(double[][]::new);

        KMeans kmeans = KMeans.fit(coordinates, 3);

        List<Prediction> predictions = new ArrayList<>();

        for (double[] centroid : kmeans.centroids) {
            double lat = centroid[0];
            double lon = centroid[1];

            // If too close to a report, jitter it slightly
            if (isTooCloseToExistingReports(lat, lon, allReports)) {
                lat += (Math.random() - 0.5) * 0.0006; // jitter up to ~±30m
                lon += (Math.random() - 0.5) * 0.0006;
            }

            Location location = new Location(lat, lon);
            locationRepository.save(location); // save explicitly

            Prediction prediction = new Prediction();
            prediction.setLocation(location);

            predictionRepository.save(prediction);
            predictions.add(prediction);
        }

        return predictions;
    }

    @Override
    public List<Prediction> getAllPredictions() {
        return predictionRepository.findAll();
    }
}
