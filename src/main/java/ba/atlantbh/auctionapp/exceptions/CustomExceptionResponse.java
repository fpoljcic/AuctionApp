package ba.atlantbh.auctionapp.exceptions;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class CustomExceptionResponse {
    private Timestamp timestamp;
    private Integer status;
    private String error;
    private String message;
    private String path;
}
