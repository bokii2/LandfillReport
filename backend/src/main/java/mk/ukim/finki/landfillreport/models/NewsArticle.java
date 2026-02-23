package mk.ukim.finki.landfillreport.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Table(name = "news_articles")
@Getter
@Setter
@Data
@Entity
public class NewsArticle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String title;

    @Column(length = 1000, unique = true)
    private String url;

    private String source;

    private LocalDateTime scrapedAt;

    public NewsArticle() {
    }

    public NewsArticle(Long id, String title, String url, String source, LocalDateTime scrapedAt) {
        this.id = id;
        this.title = title;
        this.url = url;
        this.source = source;
        this.scrapedAt = scrapedAt;
    }
}
