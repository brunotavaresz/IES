package com.beachcontrol.api.model.Beach;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public class PolutantMetric {
   
    @NotNull(message = "Pollutant type is required")
    private PolutantType type;

    @NotNull(message = "Concentration is required")
    @DecimalMin(value = "0", message = "Concentration must be greater than or equal to 0")
    private int concentration;

    public PolutantMetric() {
    }

    public PolutantMetric(PolutantType type, int concentration) {
        this.type = type;
        this.concentration = concentration;
    }

    public PolutantType getType() {
        return type;
    }

    public void setType(PolutantType type) {
        this.type = type;
    }

    public int getConcentration() {
        return concentration;
    }

    public void setConcentration(int concentration) {
        this.concentration = concentration;
    }
}
