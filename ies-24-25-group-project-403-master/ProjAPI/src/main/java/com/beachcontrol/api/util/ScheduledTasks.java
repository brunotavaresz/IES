package com.beachcontrol.api.util;

import com.beachcontrol.api.model.Beach.Beach;
import com.beachcontrol.api.model.Beach.BeachMetric;
import com.beachcontrol.api.model.Beach.PolutantMetric;
import com.beachcontrol.api.model.Beach.Wind;
import com.beachcontrol.api.model.Sensor.Sensor;
import com.beachcontrol.api.service.BeachService;
import com.beachcontrol.api.service.SensorService;
import com.beachcontrol.api.model.Sensor.SensorType;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class ScheduledTasks {

    private final SensorService sensorService;
    private final BeachService beachService;

    @Autowired
    private static final Logger logger = LoggerFactory.getLogger(ScheduledTasks.class);

    public ScheduledTasks(SensorService sensorService, BeachService beachService) {
        this.sensorService = sensorService;
        this.beachService = beachService;
    }

    @Scheduled(fixedRate = 600000) // Every 10 minute
    public void updateBeachData() {
        try {

            // Fetch all sensors
            List<Sensor> sensors = sensorService.getAvaliableSensors();
            logger.info("Updating beach data with {} sensors", sensors.size());
            // Group sensors by beachId and update the respective beaches
            Map<String, List<Sensor>> sensorsByBeach = sensors.stream()
                    .collect(Collectors.groupingBy(Sensor::getBeachId));

            sensorsByBeach.forEach((beachId, sensorList) -> {
                Beach beach = beachService.getBeachById(beachId).get();
                BeachMetric metric = new BeachMetric();
                metric.setTimestamp(Instant.now());
                for (Sensor sensor : sensorList) {
                    Instant lastChecked = sensor.getState().getLastChecked();
                    if (lastChecked == null) {
                        continue;
                    }
                    if (sensor.getState().getLastChecked()
                            .isBefore(Instant.now().minus(5, java.time.temporal.ChronoUnit.MINUTES))) {
                        continue;
                    }
                    switch (sensor.getType()) { // Assuming sensors have a type field
                        case SensorType.TEMPERATURE:
                            metric.setTemperature(sensor.getValue());
                            break;
                        case SensorType.WATER_TEMPERATURE:
                            metric.setWater_temperature(sensor.getValue());
                            break;
                        case SensorType.HUMIDITY:
                            metric.setHumidity(sensor.getValue());
                            break;
                        case SensorType.CLOUD_COVERAGE:
                            metric.setCloud_coverage(sensor.getValue());
                            break;
                        case SensorType.UV_INDEX:
                            metric.setUv_index(sensor.getValue());
                            break;
                        case SensorType.WIND:
                            Wind wind = new Wind(sensor.getValue(), sensor.getDirection());
                            metric.setWind(wind);
                            break;
                        case SensorType.PRECIPITATION:
                            metric.setPrecipitation(sensor.getValue());
                            break;
                        case SensorType.WAVE_HEIGHT:
                            metric.setWaveHeight(sensor.getValue());
                            break;
                        case SensorType.TIDE_HEIGHT:
                            metric.setTideHeight(sensor.getValue());
                            break;
                        case SensorType.POLUTANT:
                            List<PolutantMetric> polutants = new ArrayList<>();
                            Double[] values = sensor.getPolutats();
                            for (int i = 0; i < values.length; i++) {
                                PolutantMetric polutant = new PolutantMetric();
                                polutant.setType(sensor.getPolutantType().get(i));
                                polutant.setConcentration(values[i] != null ? values[i].intValue() : 0);
                                polutants.add(polutant);
                            }
                            metric.setPolutant(polutants);
                            break;
                        default:
                            // Ignore unknown sensor types
                            break;

                    }
                }
                beachService.updateBeachMetric(beachId, metric);
            });

        } catch (Exception e) {
            LoggerFactory.getLogger(ScheduledTasks.class).error("Error updating beach data", e);
        }
    }
}
