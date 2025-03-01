package mk.ukim.finki.landfillreport.service;

import mk.ukim.finki.landfillreport.models.LandfillImage;
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

    public LandfillImage uploadImage(MultipartFile file) throws IOException {
        LandfillImage imageData = new LandfillImage(
                file.getOriginalFilename(),
                file.getContentType(),
                ImageUtils.compressImage(file.getBytes())
        );

        return imageRepository.save(imageData);
    }

/*    public byte[] downloadImage(String fileName){
        Optional<LandfillImage> dbLandfillImage = imageRepository.findByName(fileName);
        byte[] images = ImageUtils.decompressImage(dbLandfillImage.get().getImageData());

        return images;
    }*/

    public Optional<LandfillImage> getImageById(Long id) {
        return imageRepository.findById(id);
    }
}
