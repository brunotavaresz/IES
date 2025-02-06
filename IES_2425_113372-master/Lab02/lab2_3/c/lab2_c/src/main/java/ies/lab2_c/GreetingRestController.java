package ies.lab2_c;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GreetingRestController {

    @GetMapping("/api/greeting")
    public Greeting greeting(@RequestParam(name = "name", required = false, defaultValue = "World") String name) {
        return new Greeting(String.format("Hello, %s!", name));
    }
    
    static class Greeting {
        private final String message;

        public Greeting(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }
    }
}
