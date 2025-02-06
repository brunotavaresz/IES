package com.beachcontrol.api.exception;

import org.springframework.http.HttpStatus;

public class ReportNotFoundException extends CustomException {
    public ReportNotFoundException(String message) {
        super(message, HttpStatus.NOT_FOUND);
    }
}
