package com.beachcontrol.api.repository;

import com.beachcontrol.api.model.User.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface UserRepository extends MongoRepository<User, String> {

    User findByEmail(String email); // Buscar usuário por email

    List<User> findByRole(String role); // Buscar usuários por função (role)

    boolean existsByEmail(String email); // Verificar se existe usuário com email
    

}
