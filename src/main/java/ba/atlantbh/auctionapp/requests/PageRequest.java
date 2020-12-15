package ba.atlantbh.auctionapp.requests;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Min;

@Data
@NoArgsConstructor
public class PageRequest {

    @Min(value = 0, message = "Page number can't be negative")
    private Integer page = 0;

    @Min(value = 0, message = "Page size can't be negative")
    private Integer size = 7;
}
