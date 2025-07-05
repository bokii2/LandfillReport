package mk.ukim.finki.landfillreport.service;

import mk.ukim.finki.landfillreport.models.Location;
import mk.ukim.finki.landfillreport.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocationService {
    private LocationRepository locationRepository;

    @Autowired
    public LocationService(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    public void saveLocation(Location location) {
        locationRepository.save(location);
    }
    public List<Location> getAllLocations() {
        return locationRepository.findAll();
    }
}
