package ba.atlantbh.auctionapp.requests;

import lombok.AllArgsConstructor;
import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
@AllArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "First name can't be blank")
    private String firstName;

    @NotBlank(message = "Last name can't be blank")
    private String lastName;

    @NotBlank(message = "Email can't be blank")
    @Email(message = "Wrong email format")
    private String email;

    @NotBlank(message = "Password can't be blank")
    @Size(min = 8, message = "Password needs at least 8 characters")
    private String password;
}
