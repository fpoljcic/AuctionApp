package ba.atlantbh.auctionapp.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ForgotPassRequest {

    @NotBlank(message = "Email can't be blank")
    @Email(message = "Wrong email format")
    @Size(max = 100, message = "Email can't be longer than 100 characters")
    private String email;
}
