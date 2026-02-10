package mk.ukim.finki.landfillreport.repository;

import mk.ukim.finki.landfillreport.models.NewsArticle;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NewsArticleRepository extends JpaRepository<NewsArticle, Long> {
    boolean existsByUrl(String url);
}
