package mk.ukim.finki.landfillreport.repository;

import mk.ukim.finki.landfillreport.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserProfileRepository extends JpaRepository<User, Long> {
}
