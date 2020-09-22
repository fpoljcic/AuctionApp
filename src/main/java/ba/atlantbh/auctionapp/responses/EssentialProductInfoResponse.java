package ba.atlantbh.auctionapp.responses;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class EssentialProductInfoResponse {
    private UUID id;
    private String name;
    private Integer startPrice;
    private String description;
    private String url;
}
