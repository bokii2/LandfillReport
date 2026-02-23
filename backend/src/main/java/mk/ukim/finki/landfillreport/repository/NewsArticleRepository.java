package mk.ukim.finki.landfillreport.repository;

import mk.ukim.finki.landfillreport.models.NewsArticle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface NewsArticleRepository extends JpaRepository<NewsArticle, Long> {
    boolean existsByUrl(String url);
    void deleteByScrapedAtBefore(LocalDateTime dateTime);
}
