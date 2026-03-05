package mk.ukim.finki.landfillreport.scheduler;

import jakarta.annotation.PostConstruct;
import mk.ukim.finki.landfillreport.service.NewsArticleService;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.time.LocalDateTime;

@EnableScheduling
@Configuration
public class ScrapingScheduler {

    private final NewsArticleService scraper;

    public ScrapingScheduler(NewsArticleService scraper) {
        this.scraper = scraper;
    }

//    @PostConstruct
//    public void runOnStartup() {
//        LocalDateTime cutOff = LocalDateTime.now().minusDays(3);
//        scraper.deleteOldNews(cutOff);
//
//        scraper.scrapeForKeyword("депонија");
//        scraper.scrapeForKeyword("диви депонии");
//        scraper.scrapeForKeyword("отпад");
//    }

//    @Scheduled(cron = "0 0 3 * * *") // every day at 03:00
//    public void scrapeDaily() {
//        scraper.scrapeForKeyword("депонија");
//        scraper.scrapeForKeyword("диви депонии");
//        scraper.scrapeForKeyword("отпад");
//    }

//    @Scheduled(cron = "0 0 3 * * *")
//    public void cleanupOldNews() {
//        LocalDateTime cutOff = LocalDateTime.now().minusDays(30);
//        scraper.deleteOldNews(cutOff);
//    }
}
