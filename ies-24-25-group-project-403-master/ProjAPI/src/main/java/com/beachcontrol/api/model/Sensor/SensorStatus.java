package com.beachcontrol.api.model.Sensor;

import java.time.Instant;
import jakarta.validation.constraints.*;

public class SensorStatus {
   
   @NotNull(message = "Sensor state is required")
   private Boolean state;  // Changed from boolean to Boolean for validation

   @NotNull(message = "Last checked timestamp is required")
   @PastOrPresent(message = "Last checked time cannot be in the future")
   private Instant lastChecked;

   // Custom validation to ensure lastChecked is not too old
   @AssertTrue(message = "Sensor status is too old - must be updated within last 24 hours")
   private boolean isLastCheckedRecent() {
       if (lastChecked == null) {
           return true; // Let @NotNull handle this
       }
       Instant oneDayAgo = Instant.now().minus(24, java.time.temporal.ChronoUnit.HOURS);
       return lastChecked.isAfter(oneDayAgo);
   }

   public SensorStatus() {
       // Default constructor for validation
   }

   public SensorStatus(Boolean state, Instant lastChecked) {
       this.state = state;
       this.lastChecked = lastChecked;
   }

   public Boolean getState() {
       return state;
   }

   public void setState(Boolean state) {
       this.state = state;
   }

   public Instant getLastChecked() {
       return lastChecked;
   }

   public void setLastChecked(Instant lastChecked) {
       this.lastChecked = lastChecked;
   }

   @Override
   public String toString() {
       return "SensorStatus{" +
               "state=" + state +
               ", lastChecked=" + lastChecked +
               '}';
   }

   // Optional: Add method to check if sensor is currently active
   public boolean isActive() {
       return state != null && state && isLastCheckedRecent();
   }
}