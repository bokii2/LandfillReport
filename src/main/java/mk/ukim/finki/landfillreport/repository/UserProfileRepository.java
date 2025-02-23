package mk.ukim.finki.landfillreport.repository;

import mk.ukim.finki.landfillreport.model.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
}
