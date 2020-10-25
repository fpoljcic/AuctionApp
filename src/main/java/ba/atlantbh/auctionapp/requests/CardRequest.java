package ba.atlantbh.auctionapp.requests;

import lombok.AllArgsConstructor;
import lombok.Data;

import javax.validation.constraints.*;

@Data
@AllArgsConstructor
public class CardRequest {

    @NotBlank(message = "Name can't be blank")
    private String name;

    @NotBlank(message = "Card number can't be blank")
    @Size(max = 16, message = "Card number can't be longer than 16 characters")
    private String cardNumber;

    @NotNull(message = "Expiration year is required")
    @Min(value = 2000, message = "Expiration year can't be before 2000")
    @Max(value = 9999, message = "Expiration year can't be after 9999")
    private Integer expirationYear;

    @NotNull(message = "Expiration month is required")
    @Min(value = 1, message = "Expiration month can't be less than 1")
    @Max(value = 12, message = "Expiration month can't be more than 12")
    private Integer expirationMonth;

    @NotNull(message = "Cvc is required")
    @Min(value = 100, message = "Cvc can't be less than 3 characters")
    @Max(value = 9999, message = "Cvc can't be more than 4 characters")
    private Short cvc;
}
