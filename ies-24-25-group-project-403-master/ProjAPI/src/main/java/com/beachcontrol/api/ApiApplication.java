package com.beachcontrol.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;


@OpenAPIDefinition
@SpringBootApplication
@EnableMongoRepositories(basePackages = "com.beachcontrol.api.repository")
@EnableScheduling
public class ApiApplication {

	public static void main(String[] args) {	
		SpringApplication.run(ApiApplication.class, args);
	}

}
