package mk.ukim.finki.landfillreport.web;

import mk.ukim.finki.landfillreport.models.Location;
import mk.ukim.finki.landfillreport.service.impl.LocationServiceImpl;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class LocationController {
    private final LocationServiceImpl locationServiceImpl;

    public LocationController(LocationServiceImpl locationServiceImpl) {
        this.locationServiceImpl = locationServiceImpl;
    }

    @GetMapping
    public List<Location> getAllLocations() {
        return locationServiceImpl.getAllLocations();
    }
}
