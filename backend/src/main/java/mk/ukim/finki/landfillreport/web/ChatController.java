package mk.ukim.finki.landfillreport.web;

import lombok.RequiredArgsConstructor;
import mk.ukim.finki.landfillreport.models.ChatRequest;
import mk.ukim.finki.landfillreport.service.GroqService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:3000")
public class ChatController {

    private final GroqService groqService;

    public ChatController(GroqService groqService) {
        this.groqService = groqService;
    }

    @PostMapping
    public Map<String, String> chat(@RequestBody ChatRequest request) {

        String answer = groqService.ask(request.getMessage());

        return Map.of("reply", answer);
    }
}