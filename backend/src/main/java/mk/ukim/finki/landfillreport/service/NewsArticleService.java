package mk.ukim.finki.landfillreport.service;

import mk.ukim.finki.landfillreport.models.NewsArticle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

public interface NewsArticleService {
    Page<NewsArticle> getAllNews(Pageable pageable);
    void scrapeForKeyword(String keyword);
    void deleteOldNews(LocalDateTime cutOff);
}
