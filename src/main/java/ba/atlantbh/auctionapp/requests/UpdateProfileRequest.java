package ba.atlantbh.auctionapp.requests;

import ba.atlantbh.auctionapp.models.enums.Gender;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.Valid;
import javax.validation.constraints.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class UpdateProfileRequest {
    @NotBlank(message = "First name can't be blank")
    @Size(min = 2, message = "First name must have at least 2 characters")
    @Size(max = 100, message = "First name can't be longer than 100 characters")
    private String firstName;

    @NotBlank(message = "Last name can't be blank")
    @Size(min = 2, message = "Last name must have at least 2 characters")
    @Size(max = 100, message = "Last name can't be longer than 100 characters")
    private String lastName;

    @NotNull(message = "Gender is required")
    private Gender gender;

    @NotNull(message = "Date of birth is required")
    private LocalDateTime dateOfBirth;

    @NotBlank(message = "Email can't be blank")
    @Email(message = "Wrong email format")
    @Size(max = 100, message = "Email can't be longer than 100 characters")
    private String email;

    @NotBlank(message = "Phone can't be blank")
    @Size(max = 32, message = "Phone can't be longer than 32 characters")
    private String phone;

    private String photo = "http://www.gnd.center/bpm/resources/img/avatar-placeholder.gif";

    @Valid
    private CardRequest card;

    @Size(max = 255, message = "Address can't be longer than 255 characters")
    private String street;

    @Size(max = 255, message = "Country can't be longer than 255 characters")
    private String country;

    @Size(max = 255, message = "City can't be longer than 255 characters")
    private String city;

    @Size(max = 255, message = "State can't be longer than 255 characters")
    private String state;

    @Size(max = 32, message = "Zip code can't be longer than 32 characters")
    private String zip;
}
