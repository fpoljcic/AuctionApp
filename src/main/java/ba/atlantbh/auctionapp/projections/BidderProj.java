package ba.atlantbh.auctionapp.projections;

import java.math.BigDecimal;
import java.util.UUID;

public interface BidderProj {
    UUID getId();
    String getEmail();
    Boolean getEmailNotify();
    Boolean getPushNotify();
    BigDecimal getMaxBid();
}
