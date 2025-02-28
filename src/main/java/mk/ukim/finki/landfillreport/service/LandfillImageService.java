/*package mk.ukim.finki.landfillreport.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Service
public class LandfillImageService {
    public LandfillImageService() {
    }

    public String saveImage(MultipartFile image) {
        String uploadDir = "uploads/landfill_images";
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
        File file = new File(dir, fileName);
        try {
            image.transferTo(file);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return file.getPath();
    }
}*/
