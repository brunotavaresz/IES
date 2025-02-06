package com.beachcontrol.api.model.Beach;

import java.time.Instant;
import jakarta.validation.constraints.*;

public class Warning {

    @NotBlank(message = "Warning title is required")
    @Size(min = 2, max = 100, message = "Title must be between 2 and 100 characters")
    private String title;

    @NotNull(message = "Warning date is required")
    @PastOrPresent(message = "Warning date cannot be in the future")
    private Instant date;

    @NotBlank(message = "Warning description is required")
    @Size(min = 10, max = 500, message = "Description must be between 10 and 500 characters")
    private String description;

    public Warning() {
    }

    public Warning(Instant date, String description, String title) {

        this.date = date;
        this.title = title;
        this.description = description;
    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Instant getDate() {
        return this.date;
    }

    public void setDate(Instant date) {
        this.date = date;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "{, title='" + getTitle() + "'" +
                ", date='" + getDate() + "'" +
                ", description='" + getDescription() + "'" +
                "}";
    }

    @Override
    public boolean equals(Object o) {
        if (o == this)
            return true;
        if (!(o instanceof Warning)) {
            return false;
        }
        Warning warning = (Warning) o;
        return title.equals(warning.title) && date.equals(warning.date) && description.equals(warning.description);
    }
}