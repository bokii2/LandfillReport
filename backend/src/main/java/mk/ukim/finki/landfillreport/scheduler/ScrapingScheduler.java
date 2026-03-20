package mk.ukim.finki.landfillreport.scheduler;

import mk.ukim.finki.landfillreport.service.NewsArticleService;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.concurrent.CompletableFuture;

@EnableScheduling
@Component
public class ScrapingScheduler {

    private final NewsArticleService scraper;

    public ScrapingScheduler(NewsArticleService scraper) {
        this.scraper = scraper;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void runOnStartup() {
        CompletableFuture.runAsync(() -> {
            LocalDateTime cutOff = LocalDateTime.now().minusDays(3);
            scraper.deleteOldNews(cutOff);

            scraper.scrapeForKeyword("депонија");
            scraper.scrapeForKeyword("диви депонии");
            scraper.scrapeForKeyword("отпад");
        });
    }
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
