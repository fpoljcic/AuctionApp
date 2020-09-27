package ba.atlantbh.auctionapp.responses;

import java.time.LocalDateTime;
import java.util.UUID;

public interface FullProductResponse {
    UUID getId();
    String getName();
    String getDescription();
    Integer getStartPrice();
    LocalDateTime getEndDate();
    Boolean getWished();
    UUID getPhotoId();
    String getPhotoUrl();
    Boolean getPhotoFeatured();
}
