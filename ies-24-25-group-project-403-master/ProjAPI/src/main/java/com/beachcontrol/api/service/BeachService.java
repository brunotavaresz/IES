package com.beachcontrol.api.service;

import com.beachcontrol.api.model.Beach.Beach;
import com.beachcontrol.api.model.Beach.Location;
import com.beachcontrol.api.repository.BeachRepository;

import jakarta.persistence.EntityNotFoundException;

import com.beachcontrol.api.model.Beach.Flag_Type;
import com.beachcontrol.api.model.Beach.BeachMetric;
import com.beachcontrol.api.model.Beach.Warning;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class BeachService {

    @Autowired
    private BeachRepository beachRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    public List<Beach> getAllBeaches() {
        return beachRepository.findAll();
    }

    public Optional<Beach> getBeachById(String id) {
        return beachRepository.findById(id);
    }

    public List<Beach> getBeachByName(String name) {
        return beachRepository.findByName(name);
    }

    public List<Beach> getBeachByLocation(Location location) {
        return beachRepository.findByLocation(location);
    }

    public Beach createBeach(Beach beach) {
        return beachRepository.save(beach);
    }

    public void updateBeach(String id, Beach beach) {
        beachRepository.deleteById(id);
        beach.setBeachId(id);
        beachRepository.save(beach);
    }

    public void deleteBeach(String id) {
        beachRepository.deleteById(id);
    }

    public boolean existsByName(String name) {
        return beachRepository.existsByName(name);
    }

    public boolean existsById(String id) {
        return beachRepository.existsById(id);
    }

    public void setBeachFlag(String id, Flag_Type flag) {
        Beach beach = beachRepository.findById(id).get();
        beach.setFlag(flag);
        beachRepository.save(beach);
    }

    public void updateBeachMetric(String id, BeachMetric metric) {
        Beach beach = beachRepository.findById(id).get();
        beach.addBeachMetric(metric);
        beachRepository.save(beach);
    }

    public void addBeachWarning(String id, Warning warning) {
        Beach beach = beachRepository.findById(id).get();
        beach.addWarning(warning);
        beachRepository.save(beach);
    }

    public void updateBeachWarning(String id, Warning warning) {
        Beach beach = beachRepository.findById(id).get();
        beach.addWarning(warning);
        beachRepository.save(beach);
    }

    public boolean removeBeachWarning(String id, Warning warning) {
        try {
            Beach beach = beachRepository.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("Beach not found"));

            List<Warning> warnings = beach.getWarnings();
            boolean removed = warnings.removeIf(w -> w.equals(warning));

            if (removed) {
                beach.setWarnings(warnings);
                beachRepository.save(beach);
                System.out.println("Warning removed");
            }

            return removed;
        } catch (Exception e) {
            return false;
        }
    }

    public List<Warning> getBeachWarnings(String id) {
        return beachRepository.findById(id).get().getWarnings();
    }

    public List<BeachMetric> getBeachMetrics(String id) {
        return beachRepository.findById(id).get().getBeachmetric();
    }

    public Beach getBeachMetricsDate(String id, Instant startDate, Instant endDate) {
        if (startDate.compareTo(endDate) > 0) {
            throw new IllegalArgumentException("Start date must be before end date");
        }
        Beach beach = beachRepository.findById(id).get();
        beach.getBeachmetric()
                .removeIf(bm -> bm.getTimestamp().compareTo(startDate) < 0 || bm.getTimestamp().compareTo(endDate) > 0);
        return beach;
    }

}
