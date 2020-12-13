package ba.atlantbh.auctionapp.projections;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public interface SimpleBidProj {
    UUID getId();
    String getName();
    String getPhoto();
    LocalDateTime getDate();
    BigDecimal getPrice();
    UUID getPersonId();
}
