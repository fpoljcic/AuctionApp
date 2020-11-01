package ba.atlantbh.auctionapp.responses;

import ba.atlantbh.auctionapp.models.Person;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
public class BasicPersonResponse {
    private UUID id;
    private LocalDateTime dateCreated;
    private String firstName;
    private String lastName;
    private String email;
    private String photo;
    private Boolean active;

    public BasicPersonResponse(Person person) {
        this.id = person.getId();
        this.dateCreated = person.getDateCreated();
        this.firstName = person.getFirstName();
        this.lastName = person.getLastName();
        this.email = person.getEmail();
        this.photo = person.getPhoto();
        this.active = person.getActive();
    }
}
