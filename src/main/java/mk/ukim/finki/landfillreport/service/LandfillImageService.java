package mk.ukim.finki.landfillreport.service;

import mk.ukim.finki.landfillreport.models.LandfillImage;
import mk.ukim.finki.landfillreport.models.Report;
import mk.ukim.finki.landfillreport.repository.ImageRepository;
import mk.ukim.finki.landfillreport.util.ImageUtils;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

@Service
public class LandfillImageService {
    private ImageRepository imageRepository;

    @Autowired
    public LandfillImageService(ImageRepository imageRepository) {
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
