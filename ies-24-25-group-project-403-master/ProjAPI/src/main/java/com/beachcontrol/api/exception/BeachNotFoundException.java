package com.beachcontrol.api.exception;

import org.springframework.http.HttpStatus;

public class BeachNotFoundException extends CustomException {
    public BeachNotFoundException(String message) {
        super(message, HttpStatus.NOT_FOUND);
    }
}
