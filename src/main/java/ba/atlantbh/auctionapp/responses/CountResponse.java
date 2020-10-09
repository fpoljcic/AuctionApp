package ba.atlantbh.auctionapp.responses;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CountResponse implements Comparable<CountResponse> {
    private String name;
    private Integer count;

    @Override
    public int compareTo(CountResponse o) {
        int i = o.count.compareTo(count);
        return i == 0 ? name.compareTo(o.name) : i;
    }
}
