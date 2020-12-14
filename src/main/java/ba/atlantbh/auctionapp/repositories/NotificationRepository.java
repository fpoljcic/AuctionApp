package ba.atlantbh.auctionapp.repositories;

import ba.atlantbh.auctionapp.models.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface NotificationRepository extends JpaRepository<Notification, UUID> {

    Page<Notification> findAllByPersonIdOrderByDateDesc(UUID uuid, Pageable pageable);
}
