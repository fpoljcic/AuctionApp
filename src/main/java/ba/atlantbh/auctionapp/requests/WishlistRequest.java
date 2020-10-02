package ba.atlantbh.auctionapp.requests;

import lombok.AllArgsConstructor;
import lombok.Data;

import javax.validation.constraints.NotNull;
import java.util.UUID;

@Data
@AllArgsConstructor
public class WishlistRequest {

    @NotNull(message = "Person must be supplied")
    private UUID personId;

    @NotNull(message = "Product must be supplied")
    private UUID productId;
}
