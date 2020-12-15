package ba.atlantbh.auctionapp.responses;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class NotifPageResponse {
    private List<NotificationResponse> notifications;
    private Boolean lastPage;
}
