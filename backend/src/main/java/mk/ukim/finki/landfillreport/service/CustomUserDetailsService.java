package mk.ukim.finki.landfillreport.service;

import mk.ukim.finki.landfillreport.models.UserProfile;

import java.util.Optional;

public interface CustomUserDetailsService {
    Optional<UserProfile> findUserByUsername(String username);
}
