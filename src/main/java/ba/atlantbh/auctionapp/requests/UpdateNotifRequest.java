package ba.atlantbh.auctionapp.requests;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UpdateNotifRequest {
    private Boolean emailNotify;
    private Boolean pushNotify;
}
