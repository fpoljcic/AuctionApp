package ba.atlantbh.auctionapp.projections;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public interface FullProductProj {
    UUID getId();
    UUID getPersonId();
    String getName();
    String getDescription();
    BigDecimal getStartPrice();
    LocalDateTime getStartDate();
    LocalDateTime getEndDate();
    Boolean getWished();
}
