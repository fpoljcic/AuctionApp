package ba.atlantbh.auctionapp.requests;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.UUID;

@Data
@NoArgsConstructor
public class PaymentRequest {

    @NotNull(message = "Product id is required")
    private UUID productId;

    @NotBlank(message = "Street can't be blank")
    @Size(max = 255, message = "Address can't be longer than 255 characters")
    private String street;

    @NotBlank(message = "City can't be blank")
    @Size(max = 255, message = "City can't be longer than 255 characters")
    private String city;

    @NotBlank(message = "Country can't be blank")
    @Size(max = 255, message = "Country can't be longer than 255 characters")
    private String country;

    @NotNull(message = "Zip can't be blank")
    @Size(max = 32, message = "Zip code can't be longer than 32 characters")
    private String zip;

    @NotBlank(message = "Phone can't be blank")
    @Size(max = 32, message = "Phone can't be longer than 32 characters")
    private String phone;

    @Valid
    private CardRequest card;

    @Valid
    private PayPalRequest payPal;
}
