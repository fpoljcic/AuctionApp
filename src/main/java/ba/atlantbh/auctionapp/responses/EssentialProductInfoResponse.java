package ba.atlantbh.auctionapp.responses;

import java.util.UUID;

public interface EssentialProductInfoResponse {
    UUID getId();
    String getName();
    Integer getStartPrice();
    String getDescription();
    String getUrl();
    String getCategoryName();
    String getSubcategoryName();
}
