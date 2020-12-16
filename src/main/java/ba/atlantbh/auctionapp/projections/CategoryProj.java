package ba.atlantbh.auctionapp.projections;

import java.util.UUID;

public interface CategoryProj {
    UUID getId();
    String getName();
    Integer getCount();
}
