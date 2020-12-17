package ba.atlantbh.auctionapp.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BidDeleteRequest {

    private UUID bidId;

    private UUID productId;
}
