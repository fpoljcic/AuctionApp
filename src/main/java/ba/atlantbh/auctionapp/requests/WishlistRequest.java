package ba.atlantbh.auctionapp.requests;

import lombok.AllArgsConstructor;
import lombok.Data;

import javax.validation.constraints.NotNull;
import java.util.UUID;

@Data
@AllArgsConstructor
public class WishlistRequest {

    @NotNull(message = "Person id is required")
    private UUID personId;

    @NotNull(message = "Product id is required")
    private UUID productId;
}
