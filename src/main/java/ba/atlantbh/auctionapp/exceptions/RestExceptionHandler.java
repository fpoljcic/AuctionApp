package ba.atlantbh.auctionapp.exceptions;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class RestExceptionHandler extends ResponseEntityExceptionHandler {

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatus status, WebRequest request) {
        CustomExceptionResponse body = getDefaultExceptionBody(status, request);
        body.setMessage(ex.getBindingResult().getFieldErrors().get(0).getDefaultMessage());
        return new ResponseEntity<>(body, headers, status);
    }

    @Override
    protected ResponseEntity<Object> handleMissingServletRequestParameter(MissingServletRequestParameterException ex, HttpHeaders headers, HttpStatus status, WebRequest request) {
        CustomExceptionResponse body = getDefaultExceptionBody(status, request);
        body.setMessage(ex.getMessage());
        return new ResponseEntity<>(body, headers, status);
    }

    @Override
    protected ResponseEntity<Object> handleBindException(BindException ex, HttpHeaders headers, HttpStatus status, WebRequest request) {
        CustomExceptionResponse body = getDefaultExceptionBody(status, request);
        body.setMessage(ex.getBindingResult().getFieldErrors().get(0).getDefaultMessage());
        return new ResponseEntity<>(body, headers, status);
    }

    private CustomExceptionResponse getDefaultExceptionBody(HttpStatus status, WebRequest request) {
        CustomExceptionResponse body = new CustomExceptionResponse();

        body.setStatus(status.value());
        body.setError(status.getReasonPhrase());
        body.setPath(((ServletWebRequest) request).getRequest().getRequestURI());

        return body;
    }
}
