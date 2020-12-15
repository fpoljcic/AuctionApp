package ba.atlantbh.auctionapp.services;


import ba.atlantbh.auctionapp.models.Notification;
import ba.atlantbh.auctionapp.repositories.NotificationRepository;
import ba.atlantbh.auctionapp.responses.NotificationResponse;
import ba.atlantbh.auctionapp.utilities.StringUtil;
import lombok.AllArgsConstructor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class PushService {

    private final SimpMessageSendingOperations notificationBroadcaster;
    private final NotificationRepository notificationRepository;

    public void broadcastNotification(Notification notification, String receiver) {
        notificationRepository.save(notification);
        NotificationResponse notificationResponse = new NotificationResponse(
                notification.getId(),
                notification.getType(),
                notification.getDescription(),
                notification.getProduct().getId(),
                notification.getProduct().getName(),
                StringUtil.getNotificationUrl(notification.getType(), notification.getProduct()),
                notification.getChecked()
        );
        notificationBroadcaster.convertAndSend("/topic/" + receiver, notificationResponse);
    }
}
