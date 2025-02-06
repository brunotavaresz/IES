package com.beachcontrol.api.exception;

import org.springframework.http.HttpStatus;

public class SensorNotActiveException extends CustomException {
    public SensorNotActiveException(String message) {
        super(message, HttpStatus.BAD_REQUEST);
    }
}
