package ba.atlantbh.auctionapp.projections;

import ba.atlantbh.auctionapp.models.enums.Color;
import ba.atlantbh.auctionapp.models.enums.Size;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface ReceiptProj {
    String getId();
    LocalDateTime getDate();
    BigDecimal getAmount();

    String getBidderName();
    String getStreet();
    String getCountry();
    String getCity();
    String getZip();
    String getPhone();

    String getSellerName();
    String getSellerStreet();
    String getSellerCountry();
    String getSellerCity();
    String getSellerZip();
    String getSellerPhone();

    String getName();
    String getDescription();
    Boolean getShipping();
    Color getColor();
    Size getSize();
}
