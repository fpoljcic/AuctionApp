package ba.atlantbh.auctionapp.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResetPassRequest {

    @NotNull(message = "Token is required")
    private UUID token;

    @NotBlank(message = "Password can't be blank")
    @Size(min = 8, message = "Password must have at least 8 characters")
    @Size(max = 255, message = "Password can't be longer than 255 characters")
    private String password;
}
