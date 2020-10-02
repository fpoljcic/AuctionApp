package ba.atlantbh.auctionapp.responses;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public interface SimpleBidResponse {
    UUID getId();
    String getFirstName();
    String getLastName();
    String getPhoto();
    LocalDateTime getDate();
    BigDecimal getPrice();
    UUID getPersonId();
}
