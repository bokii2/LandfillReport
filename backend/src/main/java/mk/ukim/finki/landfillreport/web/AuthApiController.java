package mk.ukim.finki.landfillreport.web;

import mk.ukim.finki.landfillreport.models.LoginRequest;
import mk.ukim.finki.landfillreport.models.Role;
import mk.ukim.finki.landfillreport.models.UserProfile;
import mk.ukim.finki.landfillreport.repository.UserProfileRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
public class AuthApiController {
    private final UserProfileRepository userProfileRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthApiController(UserProfileRepository userProfileRepository, PasswordEncoder passwordEncoder) {
        this.userProfileRepository = userProfileRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserProfile userProfile) {
        if (userProfileRepository.findByUsername(userProfile.getUsername()).isPresent()) {
            Map<String, String> error = Collections.singletonMap("message", "Username already exists!");
            return ResponseEntity.badRequest().body(error);
        }

        if (userProfileRepository.findByEmail(userProfile.getEmail()).isPresent()) {
            Map<String, String> error = Collections.singletonMap("message", "Email already exists!");
            return ResponseEntity.badRequest().body(error);
        }

        userProfile.setPassword(passwordEncoder.encode(userProfile.getPassword()));
        userProfile.setRole(Role.NORMAL_USER);

        UserProfile savedProfile = userProfileRepository.save(userProfile);

        savedProfile.setPassword(null);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedProfile);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Optional<UserProfile> userOpt = userProfileRepository.findByUsername(loginRequest.getUsername());

        if (userOpt.isPresent() && passwordEncoder.matches(loginRequest.getPassword(), userOpt.get().getPassword())) {
            UserProfile user = userOpt.get();

            String token = generateToken(user);

            user.setPassword(null);

            Map<String, Object> response = new HashMap<>();
            response.put("user", user);
            response.put("token", token);

            return ResponseEntity.ok()
                    .header("Authorization", "Bearer " + token)
                    .body(response);
        } else {
            Map<String, String> error = Collections.singletonMap("message", "Invalid username or password");
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(error);
        }
    }

    private String generateToken(UserProfile user) {
        String data = user.getUsername() + ":" + user.getRole().name() + ":" + System.currentTimeMillis();
        return Base64.getEncoder().encodeToString(data.getBytes());
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Principal principal) {
        if (principal == null) {
            Map<String, String> error = Collections.singletonMap("message", "Not authenticated");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        Optional<UserProfile> userOpt = userProfileRepository.findByUsername(principal.getName());

        if (userOpt.isPresent()) {
            UserProfile user = userOpt.get();
            user.setPassword(null);
            return ResponseEntity.ok(user);
        } else {
            Map<String, String> error = Collections.singletonMap("message", "User not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    @GetMapping("/auth/validate")
    public ResponseEntity<?> validateToken(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("valid", false));
        }

        return ResponseEntity.ok(Collections.singletonMap("valid", true));
    }
}
