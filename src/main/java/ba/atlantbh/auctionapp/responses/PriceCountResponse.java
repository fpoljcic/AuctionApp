package ba.atlantbh.auctionapp.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PriceCountResponse {
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private BigDecimal avgPrice;
    private int[] prices;
}
