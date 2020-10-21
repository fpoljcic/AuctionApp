package ba.atlantbh.auctionapp.requests;

import ba.atlantbh.auctionapp.models.enums.Color;
import ba.atlantbh.auctionapp.models.enums.Size;
import lombok.Data;

@Data
public class FilterCountRequest {
    private String query = "";
    private String category = "";
    private String subcategory = "";
    private Integer minPrice = 0;
    private Integer maxPrice = 1000000;
    private Color color = null;
    private Size size = null;
}
