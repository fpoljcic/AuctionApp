package ba.atlantbh.auctionapp.responses;

import ba.atlantbh.auctionapp.projections.SimpleProductProj;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ProductPageResponse {
    private List<SimpleProductProj> products;
    private Boolean lastPage;
}
