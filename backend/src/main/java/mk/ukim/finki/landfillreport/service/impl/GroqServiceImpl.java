package mk.ukim.finki.landfillreport.service.impl;

import lombok.RequiredArgsConstructor;
import mk.ukim.finki.landfillreport.service.GroqService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GroqServiceImpl implements GroqService {

    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.api.url}")
    private String apiUrl;

    private final WebClient.Builder webClientBuilder;

    public String ask(String message) {

        Map<String, Object> requestBody = Map.of(
                "model", "openai/gpt-oss-120b",
                "messages", List.of(
                        Map.of(
                                "role", "user",
                                "content", message
                        )
                )
        );

        Map response = webClientBuilder.build()
                .post()
                .uri(apiUrl)
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        Map choice = (Map) ((List) response.get("choices")).get(0);
        Map msg = (Map) choice.get("message");

        return (String) msg.get("content");
    }
}
