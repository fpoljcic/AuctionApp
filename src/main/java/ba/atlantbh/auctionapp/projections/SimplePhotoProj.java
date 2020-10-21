package ba.atlantbh.auctionapp.projections;

import java.util.UUID;

public interface SimplePhotoProj {
    UUID getId();
    String getUrl();
    Boolean getFeatured();
}
