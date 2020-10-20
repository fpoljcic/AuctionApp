package ba.atlantbh.auctionapp.responses;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Comparator;

@Data
@AllArgsConstructor
public class CountResponse implements Comparable<CountResponse> {
    private String name;
    private Integer count;

    @Override
    public int compareTo(CountResponse o) {
        return Comparator.comparing(CountResponse::getCount).reversed()
                .thenComparing(CountResponse::getName)
                .compare(this, o);
    }
}
