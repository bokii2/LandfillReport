package mk.ukim.finki.landfillreport.service;

import mk.ukim.finki.landfillreport.models.LandfillImage;

import java.util.Optional;

public interface LandfillImageService {
    void saveImage(LandfillImage image);
    Optional<LandfillImage> getImageById(Long id);
    Optional<LandfillImage> getImageByName(String name);
}
