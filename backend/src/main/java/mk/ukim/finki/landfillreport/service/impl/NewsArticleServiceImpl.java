package mk.ukim.finki.landfillreport.service.impl;

import mk.ukim.finki.landfillreport.models.NewsArticle;
import mk.ukim.finki.landfillreport.repository.NewsArticleRepository;
import mk.ukim.finki.landfillreport.service.NewsArticleService;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class NewsArticleServiceImpl implements NewsArticleService {
    private final NewsArticleRepository newsArticleRepository;

    public NewsArticleServiceImpl(NewsArticleRepository newsArticleRepository) {
        this.newsArticleRepository = newsArticleRepository;
    }

    private static final String BASE_SEARCH_URL = "https://time.mk/?q=";
    private static final String BASE_ARTICLE_URL = "https://time.mk/";

    @Override
    public List<NewsArticle> getAllNews() {
        return newsArticleRepository.findAll();
    }

    @Override
    public void scrapeForKeyword(String keyword) {
        try {
            String searchUrl = BASE_SEARCH_URL +
                    URLEncoder.encode(keyword, StandardCharsets.UTF_8) + "&search=news";

            Document doc = Jsoup.connect(searchUrl)
                    .userAgent("Mozilla/5.0")
                    .timeout(10_000)
                    .get();

            Elements articles = doc.select("a[href^=r/c/]");

            for (Element article : articles) {
                String title = article.text().trim();
                String relativeUrl = article.attr("href");
                String fullUrl = BASE_ARTICLE_URL + relativeUrl;

                if (title.isEmpty()) continue;
                if (newsArticleRepository.existsByUrl(fullUrl)) continue;

                NewsArticle news = new NewsArticle();
                news.setTitle(title);
                news.setUrl(fullUrl);
                news.setSource("time.mk");
                news.setScrapedAt(LocalDateTime.now());

                newsArticleRepository.save(news);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
