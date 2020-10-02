package ba.atlantbh.auctionapp.requests;

import lombok.AllArgsConstructor;
import lombok.Data;

import javax.validation.constraints.*;
import java.math.BigDecimal;
import java.util.UUID;

@Data
@AllArgsConstructor
public class BidRequest {

    @NotNull(message = "Price must be supplied")
    @DecimalMin(value = "0.01", message = "Price can't be less than $0.01")
    @DecimalMax(value = "999999.99", message = "Price can't be more than $999999.99")
    private BigDecimal price;

    @NotNull(message = "Product must be supplied")
    private UUID productId;
}
