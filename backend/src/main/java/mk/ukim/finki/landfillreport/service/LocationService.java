package mk.ukim.finki.landfillreport.service;

import mk.ukim.finki.landfillreport.models.Location;

import java.util.List;

public interface LocationService {
    void saveLocation(Location location);
    List<Location> getAllLocations();
}
