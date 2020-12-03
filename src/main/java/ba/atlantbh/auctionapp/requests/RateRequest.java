package ba.atlantbh.auctionapp.requests;

import lombok.Data;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.util.UUID;

@Data
public class RateRequest {

    @NotNull(message = "Product id is required")
    private UUID productId;

    @Min(value = 1, message = "Rating must be greater than 0")
    @Max(value = 5, message = "Rating must be less than 6")
    @NotNull(message = "Rating is required")
    private Integer rating;
}
