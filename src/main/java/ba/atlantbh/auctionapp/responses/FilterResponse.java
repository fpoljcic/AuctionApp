package ba.atlantbh.auctionapp.responses;

import ba.atlantbh.auctionapp.models.enums.Color;
import ba.atlantbh.auctionapp.models.enums.Size;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FilterResponse {
    private Color[] colors;
    private Size[] sizes;
}
