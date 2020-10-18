package ba.atlantbh.auctionapp.projections;

import java.math.BigDecimal;
import java.util.UUID;

public interface SimpleProductProj {
    UUID getId();
    String getName();
    String getDescription();
    BigDecimal getStartPrice();
    String getUrl();
    String getCategoryName();
    String getSubcategoryName();
    Boolean getWished();
}
