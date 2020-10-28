package ba.atlantbh.auctionapp.responses;

import ba.atlantbh.auctionapp.projections.ColorCountProj;
import ba.atlantbh.auctionapp.projections.SizeCountProj;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class FilterCountResponse {
    private List<ColorCountProj> colors;
    private List<SizeCountProj> sizes;
    private PriceCountResponse price;
}
