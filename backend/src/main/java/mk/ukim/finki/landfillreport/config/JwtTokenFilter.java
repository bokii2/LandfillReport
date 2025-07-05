package mk.ukim.finki.landfillreport.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import mk.ukim.finki.landfillreport.models.Role;
import mk.ukim.finki.landfillreport.models.UserProfile;
import mk.ukim.finki.landfillreport.repository.UserProfileRepository;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Base64;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Component
public class JwtTokenFilter extends OncePerRequestFilter {

    private final UserProfileRepository userRepository;

    public JwtTokenFilter(UserProfileRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        logger.info("Auth header: " + authHeader);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                String token = authHeader.substring(7).trim();
                if (token.startsWith("Bearer ")) {
                    token = token.substring(7).trim();
                }
                logger.info("Extracted token: " + token);

                String decodedToken = new String(Base64.getDecoder().decode(token));
                logger.info("Decoded token: " + decodedToken);

                String[] parts = decodedToken.split(":");
                String username = parts[0];

                Optional<UserProfile> userOpt = userRepository.findByUsername(username);

                if (userOpt.isPresent()) {
                    UserProfile user = userOpt.get();

                    List<SimpleGrantedAuthority> authorities = Collections.singletonList(
                            new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
                    );

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(username, null, authorities);

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    logger.info("Successfully authenticated user: " + username);
                } else {
                    logger.warn("User not found: " + username);
                }
            } catch (Exception e) {
                logger.error("Authentication error: " + e.getMessage(), e);
            }
        }

        filterChain.doFilter(request, response);
    }
}