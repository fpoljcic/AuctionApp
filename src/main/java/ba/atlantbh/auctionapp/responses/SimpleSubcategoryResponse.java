package ba.atlantbh.auctionapp.responses;

import java.math.BigDecimal;
import java.util.UUID;

public interface SimpleSubcategoryResponse {
    UUID getId();
    String getName();
    String getCategoryName();
    String getUrl();
    BigDecimal getStartPrice();
}
