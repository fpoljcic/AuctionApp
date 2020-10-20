package ba.atlantbh.auctionapp.responses;

import ba.atlantbh.auctionapp.models.Photo;
import ba.atlantbh.auctionapp.projections.FullProductProj;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
public class ProductResponse {
    private UUID id;
    private UUID personId;
    private String name;
    private String description;
    private BigDecimal startPrice;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Boolean wished;
    private List<Photo> photos;

    public ProductResponse(FullProductProj product, List<Photo> photos) {
        this.id = product.getId();
        this.personId = product.getPersonId();
        this.name = product.getName();
        this.description = product.getDescription();
        this.startPrice = product.getStartPrice();
        this.startDate = product.getStartDate();
        this.endDate = product.getEndDate();
        this.wished = product.getWished();
        this.photos = photos;
    }
}
