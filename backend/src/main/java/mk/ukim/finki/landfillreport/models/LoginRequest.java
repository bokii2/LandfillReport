package mk.ukim.finki.landfillreport.models;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {
        private String username;
        private String password;
}