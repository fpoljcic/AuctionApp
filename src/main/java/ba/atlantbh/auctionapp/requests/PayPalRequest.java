package ba.atlantbh.auctionapp.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PayPalRequest {

    @NotBlank(message = "Order id can't be blank")
    @Size(max = 255, message = "Order id can't be longer than 255 characters")
    private String orderId;
}
