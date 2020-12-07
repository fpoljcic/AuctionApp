package ba.atlantbh.auctionapp.projections;

import java.math.BigDecimal;
import java.util.UUID;

public interface WinnerProj {
    UUID getProductId();
    String getProductName();
    BigDecimal getMaxBid();
    String getEmail();
    Boolean getEmailNotify();
    Boolean getPushNotify();
}
