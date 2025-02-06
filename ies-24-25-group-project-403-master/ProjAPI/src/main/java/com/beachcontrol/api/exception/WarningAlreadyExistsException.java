package com.beachcontrol.api.exception;

import org.springframework.http.HttpStatus;

public class WarningAlreadyExistsException extends CustomException {
    public WarningAlreadyExistsException(String message) {
        super(message, HttpStatus.CONFLICT);
    }
}
