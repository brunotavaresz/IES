package com.beachcontrol.api.model.Beach;

import java.time.Instant;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

public class BeachMetric {

    public BeachMetric() {
    }

    public BeachMetric(Double temperature, Double water_temperature, Double humidity, Double cloud_coverage,
            Double uv_index, Wind wind, Double precipitation, List<PolutantMetric> polutant, Double waveHeight,
            Double tideHeight, Instant timestamp) {
        this.temperature = temperature;
        this.water_temperature = water_temperature;
        this.humidity = humidity;
        this.cloud_coverage = cloud_coverage;
        this.uv_index = uv_index;
        this.wind = wind;
        this.precipitation = precipitation;
        this.polutant = polutant;
        this.waveHeight = waveHeight;
        this.tideHeight = tideHeight;
        this.timestamp = timestamp;
    }

    @DecimalMin(value = "-50.0", message = "Temperature must be greater than -50°C")
    @DecimalMax(value = "50.0", message = "Temperature must be less than 50°C")
    private Double temperature;

    @DecimalMin(value = "-5.0", message = "Water temperature must be greater than -5°C")
    @DecimalMax(value = "40.0", message = "Water temperature must be less than 40°C")
    private Double water_temperature;

    @DecimalMin(value = "0.0", message = "Humidity must be greater than or equal to 0%")
    @DecimalMax(value = "100.0", message = "Humidity must be less than or equal to 100%")
    private Double humidity;

    @DecimalMin(value = "0.0", message = "Cloud coverage must be greater than or equal to 0%")
    @DecimalMax(value = "100.0", message = "Cloud coverage must be less than or equal to 100%")
    private Double cloud_coverage;

    @DecimalMin(value = "0.0", message = "UV index must be greater than or equal to 0")
    @DecimalMax(value = "12.0", message = "UV index must be less than or equal to 12")
    private Double uv_index;

    @Valid
    private Wind wind;

    @DecimalMin(value = "0.0", message = "Precipitation must be greater than or equal to 0mm")
    @DecimalMax(value = "1000.0", message = "Precipitation must be less than 1000mm")
    private Double precipitation;

    @Valid
    private List<PolutantMetric> polutant;

    @DecimalMin(value = "0.0", message = "Wave height must be greater than or equal to 0m")
    @DecimalMax(value = "30.0", message = "Wave height must be less than 30m")
    private Double waveHeight;

    @DecimalMin(value = "-5.0", message = "Tide height must be greater than -5m")
    @DecimalMax(value = "15.0", message = "Tide height must be less than 15m")
    private Double tideHeight;

    @NotNull(message = "Timestamp is required")
    @PastOrPresent(message = "Timestamp cannot be in the future")
    private Instant timestamp;

    public Double getTemperature() {
        return this.temperature;
    }

    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }

    public Double getWater_temperature() {
        return this.water_temperature;
    }

    public void setWater_temperature(Double water_temperature) {
        this.water_temperature = water_temperature;
    }

    public Double getHumidity() {
        return this.humidity;
    }

    public void setHumidity(Double humidity) {
        this.humidity = humidity;
    }

    public Double getCloud_coverage() {
        return this.cloud_coverage;
    }

    public void setCloud_coverage(Double cloud_coverage) {
        this.cloud_coverage = cloud_coverage;
    }

    public Double getUv_index() {
        return this.uv_index;
    }

    public void setUv_index(Double uv_index) {
        this.uv_index = uv_index;
    }

    public Wind getWind() {
        return this.wind;
    }

    public void setWind(Wind wind) {
        this.wind = wind;
    }

    public Double getPrecipitation() {
        return this.precipitation;
    }

    public void setPrecipitation(Double precipitation) {
        this.precipitation = precipitation;
    }

    public List<PolutantMetric> getPolutant() {
        return this.polutant;
    }

    public void setPolutant(List<PolutantMetric> polutant) {
        this.polutant = polutant;
    }

    public Double getWaveHeight() {
        return this.waveHeight;
    }

    public void setWaveHeight(Double waveHeight) {
        this.waveHeight = waveHeight;
    }

    public Double getTideHeight() {
        return this.tideHeight;
    }

    public void setTideHeight(Double tideHeight) {
        this.tideHeight = tideHeight;
    }

    public Instant getTimestamp() {
        return this.timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

}
