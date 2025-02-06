package com.beachcontrol.api.exception;

import org.springframework.http.HttpStatus;

public class DatabaseException extends CustomException {
    public DatabaseException(String message) {
        super(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
