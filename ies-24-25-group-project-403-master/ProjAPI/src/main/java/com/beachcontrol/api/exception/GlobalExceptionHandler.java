package com.beachcontrol.api.exception;

import java.util.List;
import java.util.stream.Collectors;

import org.apache.commons.lang3.ObjectUtils.Null;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(BeachNotFoundException.class)
    public ResponseEntity<Response<Null>> handleBeachNotFoundException(BeachNotFoundException ex) {
        Response<Null> response = new Response<>(HttpStatus.NOT_FOUND, ex.getMessage(), null);
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(InvalidParameterException.class)
    public ResponseEntity<Response<Null>> handleInvalidParameterException(InvalidParameterException ex) {
        Response<Null> response = new Response<>(HttpStatus.BAD_REQUEST, ex.getMessage(), null);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ReportNotFoundException.class)
    public ResponseEntity<Response<Null>> handleReportNotFoundException(ReportNotFoundException ex) {
        Response<Null> response = new Response<>(HttpStatus.NOT_FOUND, ex.getMessage(), null);
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Response<Null>> handleUserNotFoundException(UserNotFoundException ex) {
        Response<Null> response = new Response<>(HttpStatus.NOT_FOUND, ex.getMessage(), null);
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Response<Null>> handleResourceNotFoundException(ResourceNotFoundException ex) {
        Response<Null> response = new Response<>(HttpStatus.NOT_FOUND, ex.getMessage(), null);
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request) {

        // Get first validation error message
        String errorMessage = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .orElse("Validation failed");

        Response<Null> response = new Response<>(HttpStatus.BAD_REQUEST, errorMessage, null);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ResorceConflitException.class)
    public ResponseEntity<Response<Null>> handleResorceConflitException(ResorceConflitException ex) {
        Response<Null> response = new Response<>(HttpStatus.CONFLICT, ex.getMessage(), null);
        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }
}
