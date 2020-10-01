package ba.atlantbh.auctionapp.responses;

import java.time.LocalDateTime;
import java.util.UUID;

public interface FullProductResponse {
    UUID getId();
    UUID getPersonId();
    String getName();
    String getDescription();
    Float getStartPrice();
    LocalDateTime getStartDate();
    LocalDateTime getEndDate();
    Boolean getWished();
    UUID getPhotoId();
    String getPhotoUrl();
    Boolean getPhotoFeatured();
}
