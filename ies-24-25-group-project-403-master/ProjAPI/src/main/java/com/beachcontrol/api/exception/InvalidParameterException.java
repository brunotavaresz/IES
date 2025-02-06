package com.beachcontrol.api.exception;

import org.springframework.http.HttpStatus;

public class InvalidParameterException extends CustomException {
    public InvalidParameterException(String message) {
        super(message, HttpStatus.BAD_REQUEST);
    }
    
}
