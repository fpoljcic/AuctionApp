package ba.atlantbh.auctionapp.responses;

import java.util.UUID;

public interface SimpleSubcategoryResponse {
    UUID getId();
    String getName();
    String getCategoryName();
    String getUrl();
    Integer getStartPrice();
}
