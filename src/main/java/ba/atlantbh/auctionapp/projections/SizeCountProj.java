package ba.atlantbh.auctionapp.projections;

import ba.atlantbh.auctionapp.models.enums.Size;

public interface SizeCountProj {
    Size getSize();
    Integer getCount();
}
