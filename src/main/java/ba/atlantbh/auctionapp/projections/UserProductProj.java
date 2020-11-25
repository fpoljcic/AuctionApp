package ba.atlantbh.auctionapp.projections;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public interface UserProductProj {
    UUID getId();
    String getName();
    String getUrl();
    BigDecimal getPrice();
    String getCategoryName();
    String getSubcategoryName();
    LocalDateTime getStartDate();
    LocalDateTime getEndDate();
    Integer getBidCount();
    BigDecimal getMaxBid();
    UUID getPersonId();
}
