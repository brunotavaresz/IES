package com.beachcontrol.api.repository;

import com.beachcontrol.api.model.Sensor.Sensor;
import com.beachcontrol.api.model.Sensor.SensorType;


import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface SensorRepository extends MongoRepository<Sensor, String> {

    List<Sensor> findByBeachId(String beachId); // Buscar sensores de uma praia específica
    Boolean existsByBeachId(String beachId); // Verificar se existe sensor para a praia
    List<Sensor> findByType(SensorType type); // Buscar sensores de um tipo específico
}
