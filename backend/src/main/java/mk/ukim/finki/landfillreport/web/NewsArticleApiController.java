package mk.ukim.finki.landfillreport.web;

import mk.ukim.finki.landfillreport.models.NewsArticle;
import mk.ukim.finki.landfillreport.service.impl.NewsArticleServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/news")
public class NewsArticleApiController {
    private final NewsArticleServiceImpl newsArticleService;

    public NewsArticleApiController(NewsArticleServiceImpl newsArticleService) {
        this.newsArticleService = newsArticleService;
    }

    @GetMapping
    public ResponseEntity<List<NewsArticle>> getNews(){
        List<NewsArticle> newsList = newsArticleService.getAllNews();

        return ResponseEntity.ok(newsList);
    }
}
