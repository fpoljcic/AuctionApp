package ba.atlantbh.auctionapp.projections;

import java.math.BigDecimal;

public interface BidderProj {
    String getEmail();
    Boolean getEmailNotify();
    Boolean getPushNotify();
    BigDecimal getMaxBid();
}
