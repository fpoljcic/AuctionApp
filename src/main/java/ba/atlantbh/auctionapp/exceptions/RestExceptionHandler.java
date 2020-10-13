package ba.atlantbh.auctionapp.exceptions;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.sql.Timestamp;

@ControllerAdvice
public class RestExceptionHandler extends ResponseEntityExceptionHandler {

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatus status, WebRequest request) {
        CustomExceptionResponse body = new CustomExceptionResponse();

        body.setTimestamp(new Timestamp(System.currentTimeMillis()));
        body.setStatus(status.value());
        body.setError(status.getReasonPhrase());
        body.setMessage(ex.getBindingResult().getFieldErrors().get(0).getDefaultMessage());
        body.setPath(((ServletWebRequest)request).getRequest().getRequestURI());

        return new ResponseEntity<>(body, headers, status);
    }
}
