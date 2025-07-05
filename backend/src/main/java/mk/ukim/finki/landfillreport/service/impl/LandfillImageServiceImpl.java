package mk.ukim.finki.landfillreport.service.impl;

import mk.ukim.finki.landfillreport.models.LandfillImage;
import mk.ukim.finki.landfillreport.repository.ImageRepository;
import mk.ukim.finki.landfillreport.service.LandfillImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LandfillImageServiceImpl implements LandfillImageService {
    private ImageRepository imageRepository;

    @Autowired
    public LandfillImageServiceImpl(ImageRepository imageRepository) {
        this.imageRepository = imageRepository;
    }

    public void saveImage(LandfillImage image) {
        imageRepository.save(image);
    }

    public Optional<LandfillImage> getImageById(Long id) {
        return imageRepository.findById(id);
    }

    public Optional<LandfillImage> getImageByName(String name) {
        return imageRepository.findByName(name);
    }
}
