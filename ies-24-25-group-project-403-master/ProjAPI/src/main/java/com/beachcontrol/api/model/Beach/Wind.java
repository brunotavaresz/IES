package com.beachcontrol.api.model.Beach;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public class Wind {
    @NotNull(message = "Wind speed is required")
    @DecimalMin(value = "0.0", message = "Wind speed must be greater than or equal to 0")
    @DecimalMax(value = "200.0", message = "Wind speed must be less than 200")
    private Double speed;

    @NotNull(message = "Wind direction is required")
    @Pattern(regexp = "^(N|NE|E|SE|S|SW|W|NW)$", message = "Wind direction must be one of: N, NE, E, SE, S, SW, W, NW")
    private String direction;

    public Wind() {
    }

    public Wind(Double speed, String direction) {
        this.speed = speed;
        this.direction = direction;
    }

    public Double getSpeed() {
        return speed;
    }

    public void setSpeed(Double speed) {
        this.speed = speed;
    }

    public String getDirection() {
        return direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }




    
}
