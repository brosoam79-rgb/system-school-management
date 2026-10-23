package com.school.management.controller;
import org.springframework.dao.DataIntegrityViolationException; import org.springframework.http.*; import org.springframework.web.bind.MethodArgumentNotValidException; import org.springframework.web.bind.annotation.*; import java.util.*;
@RestControllerAdvice public class ApiExceptionHandler {
 @ExceptionHandler(NoSuchElementException.class) ResponseEntity<?> notFound(Exception e){return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message",e.getMessage()));}
 @ExceptionHandler({IllegalArgumentException.class,DataIntegrityViolationException.class}) ResponseEntity<?> badRequest(Exception e){String m=e instanceof IllegalArgumentException?e.getMessage():"A database constraint was violated. Check duplicate values and required fields.";return ResponseEntity.badRequest().body(Map.of("message",m==null?"Invalid request":m));}
 @ExceptionHandler(MethodArgumentNotValidException.class) ResponseEntity<?> validation(MethodArgumentNotValidException e){return ResponseEntity.badRequest().body(Map.of("message","Request validation failed"));}
}
