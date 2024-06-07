package ru.kata.spring.boot_security.demo.exception_handling;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class UserGlobalExceptionHandler {
    @ExceptionHandler
    public ResponseEntity<UserIncorrectData> handlerException(NoSuchUserException exception) {
        UserIncorrectData userIncData = new UserIncorrectData();
        userIncData.setInfo(exception.getMessage());
        return new ResponseEntity<>(userIncData, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler
    public ResponseEntity<UserIncorrectData> handlerException(Exception exception) {
        UserIncorrectData userIncData = new UserIncorrectData();
        userIncData.setInfo(exception.getMessage());
        return new ResponseEntity<>(userIncData, HttpStatus.BAD_REQUEST);
    }
}
