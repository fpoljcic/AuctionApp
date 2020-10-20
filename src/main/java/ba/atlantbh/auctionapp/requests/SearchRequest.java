package ba.atlantbh.auctionapp.requests;

import lombok.Data;

import javax.validation.constraints.Min;

@Data
public class SearchRequest {
    private String query = "";
    private String category = "";
    private String subcategory = "";
    private String sort = "";

    @Min(value = 0, message = "Page number can't be negative")
    private Integer page = 0;
}
