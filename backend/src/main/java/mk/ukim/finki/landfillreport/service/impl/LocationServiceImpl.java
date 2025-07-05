package mk.ukim.finki.landfillreport.service.impl;

import mk.ukim.finki.landfillreport.models.Location;
import mk.ukim.finki.landfillreport.repository.LocationRepository;
import mk.ukim.finki.landfillreport.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocationServiceImpl implements LocationService {
    private LocationRepository locationRepository;

    @Autowired
    public LocationServiceImpl(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    public void saveLocation(Location location) {
        locationRepository.save(location);
    }
    public List<Location> getAllLocations() {
        return locationRepository.findAll();
    }
}
