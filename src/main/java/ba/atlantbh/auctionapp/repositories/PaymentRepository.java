package ba.atlantbh.auctionapp.repositories;

import ba.atlantbh.auctionapp.models.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {

    @Query(value = "SELECT EXISTS(SELECT 1 FROM payment WHERE product_id = :product_id AND person_id = :user_id)", nativeQuery = true)
    Boolean isProductPaidByUser(@Param("user_id") String userId, @Param("product_id") String productId);
}
