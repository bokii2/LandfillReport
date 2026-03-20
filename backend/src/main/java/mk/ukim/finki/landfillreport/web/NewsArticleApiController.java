package mk.ukim.finki.landfillreport.web;

import mk.ukim.finki.landfillreport.models.NewsArticle;
import mk.ukim.finki.landfillreport.service.impl.NewsArticleServiceImpl;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
    public ResponseEntity<Page<NewsArticle>> getNews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size
    ) {
        return ResponseEntity.ok(newsArticleService.getAllNews(PageRequest.of(page, size, Sort.by("scrapedAt").descending())));
    }
}
