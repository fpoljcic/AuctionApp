package ba.atlantbh.auctionapp.responses;

import java.math.BigDecimal;
import java.util.UUID;

public interface SimpleProductResponse {
    UUID getId();
    String getName();
    BigDecimal getStartPrice();
    String getDescription();
    String getUrl();
    String getCategoryName();
    String getSubcategoryName();
    Boolean getWished();
}
