package ba.atlantbh.auctionapp.services;

import ba.atlantbh.auctionapp.exceptions.BadRequestException;
import ba.atlantbh.auctionapp.models.Notification;
import ba.atlantbh.auctionapp.repositories.NotificationRepository;
import ba.atlantbh.auctionapp.responses.NotifPageResponse;
import ba.atlantbh.auctionapp.responses.NotificationResponse;
import ba.atlantbh.auctionapp.security.JwtTokenUtil;
import ba.atlantbh.auctionapp.utilities.StringUtil;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotifPageResponse getNotifications(Integer page, Integer size) {
        UUID personId = JwtTokenUtil.getRequestPersonId();
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<Notification> notifs = notificationRepository.findAllByPersonIdOrderByDateDesc(personId, pageRequest);
        return new NotifPageResponse(notifs.stream().map(notification ->
                new NotificationResponse(
                        notification.getId(),
                        notification.getType(),
                        notification.getDescription(),
                        notification.getProduct().getId(),
                        notification.getProduct().getName(),
                        StringUtil.getNotificationUrl(notification.getType(), notification.getProduct()),
                        notification.getChecked()
                )
        ).collect(Collectors.toList()), !notifs.hasNext());
    }

    public void checkNotifications(List<UUID> ids) {
        UUID personId = JwtTokenUtil.getRequestPersonId();
        List<Notification> notifications = notificationRepository.findAllById(ids);
        for (Notification notification : notifications) {
            if (!notification.getPerson().getId().equals(personId))
                throw new BadRequestException("One or more notifications can't be checked");
            notification.setChecked(true);
        }
        notificationRepository.saveAll(notifications);
    }
}
