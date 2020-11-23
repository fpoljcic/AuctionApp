package ba.atlantbh.auctionapp.responses;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class SubcategoryResponse {
    private UUID id;
    private String name;
}
