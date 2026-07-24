package in.tech_camp.backend.exception;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1. バリデーションエラーが発生した場合（400 Bad Request）
    @ExceptionHandler(BindException.class)
    public ResponseEntity<?> handleValidationException(BindException ex) {
        List<String> errorMessages = ex.getBindingResult().getAllErrors().stream()
                .map(error -> error.getDefaultMessage())
                .collect(Collectors.toList());

        return ResponseEntity.badRequest().body(Map.of("messages", errorMessages));
    }

    // 2. 画像保存処理で IOException が発生した場合（500 Internal Server Error）
    @ExceptionHandler(IOException.class)
    public ResponseEntity<?> handleIOException(IOException ex) {
        ex.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("messages", List.of("画像の保存に失敗しました")));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> handleNotFoundException(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("messages", List.of(ex.getMessage())));
    }

    @ExceptionHandler(SecurityException.class)
    public ResponseEntity<?> handleSecurityException(SecurityException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("messages", List.of(ex.getMessage())));
    }

    // 5. その他の予期せぬエラーが発生した場合（500 Internal Server Error）
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGeneralException(Exception ex) {
        ex.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("messages", List.of("Internal Server Error")));
    }
}