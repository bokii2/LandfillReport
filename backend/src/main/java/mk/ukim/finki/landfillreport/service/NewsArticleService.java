package mk.ukim.finki.landfillreport.service;

import mk.ukim.finki.landfillreport.models.NewsArticle;

import java.time.LocalDateTime;
import java.util.List;

public interface NewsArticleService {
    List<NewsArticle> getAllNews();
    void scrapeForKeyword(String keyword);
    void deleteOldNews(LocalDateTime cutOff);
}
