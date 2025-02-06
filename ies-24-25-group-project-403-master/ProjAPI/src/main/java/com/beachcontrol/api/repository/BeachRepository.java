package com.beachcontrol.api.repository;

import com.beachcontrol.api.model.Beach.Beach;
import com.beachcontrol.api.model.Beach.Flag_Type;
import com.beachcontrol.api.model.Beach.Location;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface BeachRepository extends MongoRepository<Beach, String> {

    List<Beach> findByLocation(Location location); // Buscar praias por localização

    List<Beach> findByFlag(Flag_Type flag); // Buscar praias por bandeira

    List<Beach> findByName(String name); // Buscar praias por nome

    boolean existsByName(String name); // Verificar se existe praia com nome
}
