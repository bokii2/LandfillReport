package mk.ukim.finki.landfillreport.web;

import mk.ukim.finki.landfillreport.models.Role;
import mk.ukim.finki.landfillreport.models.UserProfile;
import mk.ukim.finki.landfillreport.repository.UserProfileRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class AuthController {
    private final UserProfileRepository userProfileRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserProfileRepository userProfileRepository, PasswordEncoder passwordEncoder) {
        this.userProfileRepository = userProfileRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/register")
    public String showRegistrationForm() {
        return "register";
    }

    @PostMapping("/register")
    public String registerUser(UserProfile userProfile, Model model) {
        if (userProfileRepository.findByUsername(userProfile.getUsername()).isPresent()) {
            model.addAttribute("error", "Username already exists!");
            return "register";
        }

        if (userProfileRepository.findByEmail(userProfile.getEmail()).isPresent()) {
            model.addAttribute("error", "Email already exists!");
            return "register";
        }

        userProfile.setPassword(passwordEncoder.encode(userProfile.getPassword()));
        userProfile.setRole(Role.NORMAL_USER);

        userProfileRepository.save(userProfile);
        return "redirect:/login";
    }

    @GetMapping("/login")
    public String showLoginForm() {
        return "login";
    }
}

