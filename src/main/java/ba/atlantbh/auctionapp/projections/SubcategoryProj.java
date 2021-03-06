package ba.atlantbh.auctionapp.projections;

import java.math.BigDecimal;
import java.util.UUID;

public interface SubcategoryProj {
    UUID getId();
    String getName();
    String getCategoryName();
    String getUrl();
    BigDecimal getStartPrice();
}
