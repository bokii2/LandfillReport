package mk.ukim.finki.landfillreport.models;

import lombok.Data;

@Data
public class ChatRequest {
    private String message;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}