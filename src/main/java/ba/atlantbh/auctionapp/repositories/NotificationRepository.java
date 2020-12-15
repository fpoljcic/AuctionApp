package ba.atlantbh.auctionapp.repositories;

import ba.atlantbh.auctionapp.models.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import javax.transaction.Transactional;
import java.util.UUID;

public interface NotificationRepository extends JpaRepository<Notification, UUID> {

    Page<Notification> findAllByPersonIdOrderByDateDesc(UUID uuid, Pageable pageable);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM notification n USING product p WHERE n.product_id = p.id AND p.person_id = :id",
            nativeQuery = true)
    void deleteAllByProductFromUser(String id);
}
