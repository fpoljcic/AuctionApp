package ba.atlantbh.auctionapp.responses;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ProductPageResponse {
    private List<SimpleProductResponse> products;
    private Boolean lastPage;
}
