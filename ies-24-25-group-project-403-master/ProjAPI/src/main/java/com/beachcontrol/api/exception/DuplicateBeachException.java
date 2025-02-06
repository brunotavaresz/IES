package com.beachcontrol.api.exception;

import org.springframework.http.HttpStatus;

public class DuplicateBeachException extends CustomException {
    public DuplicateBeachException(String message) {
        super(message, HttpStatus.CONFLICT);
    }
}
