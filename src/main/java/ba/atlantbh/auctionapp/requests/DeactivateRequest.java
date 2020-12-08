package ba.atlantbh.auctionapp.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DeactivateRequest {

    @NotBlank(message = "Password can't be blank")
    private String password;
}
