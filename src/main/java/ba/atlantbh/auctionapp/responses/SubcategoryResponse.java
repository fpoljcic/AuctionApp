package ba.atlantbh.auctionapp.responses;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class SubcategoryResponse implements Comparable<SubcategoryResponse> {
    private UUID id;
    private String name;

    @Override
    public int compareTo(SubcategoryResponse o) {
        return this.name.compareTo(o.name);
    }
}
