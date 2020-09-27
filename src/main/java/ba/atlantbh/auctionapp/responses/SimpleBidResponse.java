package ba.atlantbh.auctionapp.responses;

import java.time.LocalDateTime;
import java.util.UUID;

public interface SimpleBidResponse {
    UUID getId();
    String getFirstName();
    String getLastName();
    String getPhoto();
    LocalDateTime getDate();
    Integer getPrice();
}
