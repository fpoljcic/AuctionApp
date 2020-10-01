package ba.atlantbh.auctionapp.requests;

import lombok.AllArgsConstructor;
import lombok.Data;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.util.UUID;

@Data
@AllArgsConstructor
public class BidRequest {

    @NotNull(message = "Price must be supplied")
    @Min(value = 0, message = "Price can't be less than 0")
    private Float price;

    @NotNull(message = "Product must be supplied")
    private UUID productId;
}
