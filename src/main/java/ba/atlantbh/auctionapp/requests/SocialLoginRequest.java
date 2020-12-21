package ba.atlantbh.auctionapp.requests;

import ba.atlantbh.auctionapp.models.enums.Social;
import lombok.AllArgsConstructor;
import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

@Data
@AllArgsConstructor
public class SocialLoginRequest {

    @NotBlank(message = "Id can't be blank")
    private String id;

    private Social type;

    @NotBlank(message = "Email can't be blank")
    @Email(message = "Wrong email format")
    @Size(max = 100, message = "Email can't be longer than 100 characters")
    private String email;

    @NotBlank(message = "Token can't be blank")
    private String token;

    @Size(min = 2, message = "First name must have at least 2 characters")
    @Size(max = 100, message = "First name can't be longer than 100 characters")
    @Pattern(regexp = "^[^\\p{P}\\p{S}]*$", flags = Pattern.Flag.UNICODE_CASE, message = "First name can't contain special characters")
    private String firstName;

    @Size(min = 2, message = "Last name must have at least 2 characters")
    @Size(max = 100, message = "Last name can't be longer than 100 characters")
    @Pattern(regexp = "^[^\\p{P}\\p{S}]*$", flags = Pattern.Flag.UNICODE_CASE, message = "Last name can't contain special characters")
    private String lastName;

}
