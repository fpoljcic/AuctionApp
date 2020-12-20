package ba.atlantbh.auctionapp.responses;

import ba.atlantbh.auctionapp.models.Person;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private Person person;
    private String token;
    private String type;
}
