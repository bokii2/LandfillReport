package mk.ukim.finki.landfillreport.config;

import mk.ukim.finki.landfillreport.models.Role;
import mk.ukim.finki.landfillreport.models.UserProfile;
import mk.ukim.finki.landfillreport.repository.UserProfileRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {
    private final UserProfileRepository userProfileRepository;
    private final PasswordEncoder passwordEncoder;

    public DataLoader(UserProfileRepository userProfileRepository, PasswordEncoder passwordEncoder) {
        this.userProfileRepository = userProfileRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userProfileRepository.findByUsername("admin").isEmpty()) {
            UserProfile admin = new UserProfile(
                    "Admin", "User", "admin", "admin@admin.com",
                    passwordEncoder.encode("adminpassword")
            );
            admin.setRole(Role.ADMIN);
            userProfileRepository.save(admin);
        }
    }
}

