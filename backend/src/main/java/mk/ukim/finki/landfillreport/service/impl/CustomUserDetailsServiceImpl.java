package mk.ukim.finki.landfillreport.service.impl;

import mk.ukim.finki.landfillreport.models.CustomUserDetails;
import mk.ukim.finki.landfillreport.models.UserProfile;
import mk.ukim.finki.landfillreport.repository.UserProfileRepository;
import mk.ukim.finki.landfillreport.service.CustomUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomUserDetailsServiceImpl implements UserDetailsService, CustomUserDetailsService {
    private final UserProfileRepository userProfileRepository;

    public CustomUserDetailsServiceImpl(UserProfileRepository userProfileRepository) {
        this.userProfileRepository = userProfileRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userProfileRepository.findByUsername(username)
                .map(CustomUserDetails::new)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    public Optional<UserProfile> findUserByUsername(String username) {
        return userProfileRepository.findByUsername(username);
    }
}

