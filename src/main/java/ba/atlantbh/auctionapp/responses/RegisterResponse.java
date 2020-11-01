package ba.atlantbh.auctionapp.responses;

import ba.atlantbh.auctionapp.models.Person;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RegisterResponse {
    private BasicPersonResponse person;
    private String token;

    public RegisterResponse(Person person, String token) {
        this.person = new BasicPersonResponse(person);
        this.token = token;
    }
}
