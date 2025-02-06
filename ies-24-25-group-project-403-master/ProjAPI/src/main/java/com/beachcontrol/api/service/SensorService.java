package com.beachcontrol.api.service;

import com.beachcontrol.api.model.Sensor.Sensor;
import com.beachcontrol.api.repository.SensorRepository;
import com.beachcontrol.api.model.Sensor.SensorType;
import com.beachcontrol.api.model.Sensor.SensorStatus;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SensorService {

    @Autowired
    private SensorRepository sensorRepository;

    public List<Sensor> getAllSensors() {
        return sensorRepository.findAll();
    }

    public Optional<Sensor> getSensorById(String id) {
        return sensorRepository.findById(id);
    }

    public List<Sensor> getSensorsByBeachId(String beachId) {
        return sensorRepository.findByBeachId(beachId);
    }

    public List<Sensor> getAvaliableSensors() {
        List<Sensor> allSensors = sensorRepository.findAll();
        allSensors.removeIf(sensor -> !sensor.getState().getState());
        return allSensors;
    }

    public List<Sensor> getAvaliableSensorsByBeachId(String beachId) {
        List<Sensor> allSensors = sensorRepository.findByBeachId(beachId);
        allSensors.removeIf(sensor -> !sensor.getState().getState());
        return allSensors;
    }

    public List<Sensor> getAvaliableSensorsByType(SensorType type) {
        List<Sensor> allSensors = sensorRepository.findAll();
        allSensors.removeIf(sensor -> !sensor.getState().getState() || !sensor.getType().equals(type));
        return allSensors;
    }

    public List<Sensor> getNotAvailableSensors() {
        List<Sensor> allSensors = sensorRepository.findAll();
        allSensors.removeIf(sensor -> sensor.getState().getState());
        return allSensors;
    }

    public List<Sensor> getSensorsByType(SensorType type) {
        return sensorRepository.findByType(type);
    }

    public Sensor createSensor(Sensor sensor) {
        return sensorRepository.save(sensor);
    }

    public void deleteSensor(String id) {
        sensorRepository.deleteById(id);
    }

    public Sensor updateSensor(String id, Sensor sensor) {
        if (!sensorRepository.existsById(id)) {
            throw new RuntimeException("Sensor not found with id: " + id);
        }
        sensor.setSensorId(id);
        return sensorRepository.save(sensor);
    }

    public void updateSensorStatus(String id, boolean state) {
        Optional<Sensor> sensorOpt = sensorRepository.findById(id);
        if (sensorOpt.isEmpty()) {
            throw new RuntimeException("Sensor not found with id: " + id);
        }
        Sensor sensor = sensorOpt.get();
        sensor.getState().setState(state); // Update the sensor state
        sensorRepository.save(sensor);
    }

    public String updateSensor(Sensor sensor) {
        sensorRepository.save(sensor);
        return "Sensor updated successfully";
    }
}
