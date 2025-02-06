package com.beachcontrol.api.model.Beach;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.hibernate.validator.constraints.URL;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Document(collection = "Beach")
public class Beach {

    @JsonCreator
    public Beach() {
    }

    public Beach(String id, String name, List<BeachMetric> beachmetric, List<Warning> warnings, Flag_Type flag,
            Location location, String image_url, String description) {
        super();
        this.beachId = id;
        this.name = name;
        this.beachmetric = beachmetric;
        this.location = location;
        this.warnings = warnings;
        this.flag = flag;
        this.image_url = image_url;
        this.description = description;
    }

    @Id
    @Field(value = "_id", targetType = FieldType.STRING)
    private String beachId;

    @NotBlank(message = "Beach name is required")
    @Size(min = 2, max = 100, message = "Beach name must be between 2 and 100 characters")
    private String name;

    @Valid
    private List<BeachMetric> beachmetric;

    @Valid
    private List<Warning> warnings;

    @NotNull(message = "Flag status is required")
    private Flag_Type flag;

    @Valid
    @NotNull(message = "Location is required")
    private Location location;

    @URL(message = "Invalid image URL format")
    private String image_url;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    // Methods to prevent NPE when adding to lists
    public void addBeachMetric(BeachMetric metric) {
        if (this.beachmetric == null) {
            this.beachmetric = new ArrayList<>();
        }
        this.beachmetric.add(metric);
    }

    public void addWarning(Warning warning) {
        if (this.warnings == null) {
            this.warnings = new ArrayList<>();
        }
        this.warnings.add(warning);
    }

    public String getBeachId() {
        return this.beachId;
    }

    public void setBeachId(String beachId) {
        this.beachId = beachId;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<BeachMetric> getBeachmetric() {
        return this.beachmetric;
    }

    public void setBeachmetric(List<BeachMetric> beachmetric) {
        this.beachmetric = beachmetric;
    }

    public List<Warning> getWarnings() {
        return this.warnings;
    }

    public void setWarnings(List<Warning> warnings) {
        this.warnings = warnings;
    }

    public Flag_Type getFlag() {
        return this.flag;
    }

    public void setFlag(Flag_Type flag) {
        this.flag = flag;
    }

    public Location getLocation() {
        return this.location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public String getImage_url() {
        return this.image_url;
    }

    public void setImage_url(String image_url) {
        this.image_url = image_url;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

}
