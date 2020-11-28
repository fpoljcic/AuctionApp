package ba.atlantbh.auctionapp.requests;

import lombok.AllArgsConstructor;
import lombok.Data;

import javax.validation.constraints.*;
import java.math.BigDecimal;
import java.util.UUID;

@Data
@AllArgsConstructor
public class BidRequest {

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.50", message = "Price can't be lower than $0.50")
    @DecimalMax(value = "999999.99", message = "Price can't be higher than $999999.99")
    private BigDecimal price;

    @NotNull(message = "Product id is required")
    private UUID productId;
}
