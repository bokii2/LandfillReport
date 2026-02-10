package mk.ukim.finki.landfillreport.scheduler;

import jakarta.annotation.PostConstruct;
import mk.ukim.finki.landfillreport.service.impl.NewsArticleServiceImpl;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

@EnableScheduling
@Configuration
public class ScrapingScheduler {

    private final NewsArticleServiceImpl scraper;

    public ScrapingScheduler(NewsArticleServiceImpl scraper) {
        this.scraper = scraper;
    }

//    @PostConstruct
//    public void runOnStartup() {
//        scraper.scrapeForKeyword("депонија");
//        scraper.scrapeForKeyword("диви депонии");
//        scraper.scrapeForKeyword("отпад");
//    }

    @Scheduled(cron = "0 0 3 * * *") // every day at 03:00
    public void scrapeDaily() {
        scraper.scrapeForKeyword("депонија");
        scraper.scrapeForKeyword("диви депонии");
        scraper.scrapeForKeyword("отпад");
    }
}
