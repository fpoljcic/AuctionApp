package ba.atlantbh.auctionapp.projections;

import ba.atlantbh.auctionapp.models.enums.Color;

public interface ColorCountProj {
    Color getColor();
    Integer getCount();
}
