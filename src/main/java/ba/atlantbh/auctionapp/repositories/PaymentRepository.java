package ba.atlantbh.auctionapp.repositories;

import ba.atlantbh.auctionapp.models.Payment;
import ba.atlantbh.auctionapp.projections.ReceiptProj;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {

    @Query(value = "SELECT EXISTS(SELECT 1 FROM payment WHERE product_id = :product_id AND person_id = :user_id)", nativeQuery = true)
    Boolean isProductPaidByUser(@Param("user_id") String userId, @Param("product_id") String productId);

    @Query(value = "SELECT p.person_id FROM payment p INNER JOIN product p2 on p.product_id = p2.id " +
                   "WHERE p.product_id = :product_id AND p2.person_id = :user_id", nativeQuery = true)
    Optional<UUID> getBidderIdFromReceipt(@Param("user_id") String userId, @Param("product_id") String productId);

    @Query(value = "SELECT COALESCE(p.stripe_charge_id, '') || COALESCE(p3.order_id, '') id, p.date date, p.amount amount, " +
                   "p.street street, p.country country, p.city city, p.zip zip, p.phone phone, " +
                   "p5.first_name || ' ' || p5.last_name bidderName, p2.street sellerStreet, p2.country sellerCountry, p2.city sellerCity, " +
                   "p2.zip sellerZip, p2.phone sellerPhone, p2.name, p2.description description, " +
                   "p2.shipping shipping, p2.color color, p2.size size, p4.first_name || ' ' || p4.last_name sellerName " +
                   "FROM payment p INNER JOIN product p2 on p2.id = p.product_id INNER JOIN person p5 on p5.id = p.person_id " +
                   "LEFT OUTER JOIN paypal p3 on p3.id = p.paypal_id INNER JOIN person p4 on p4.id = p2.person_id "  +
                   "WHERE p.product_id = :product_id AND p.person_id = :user_id", nativeQuery = true)
    Optional<ReceiptProj> getReceipt(@Param("user_id") String userId, @Param("product_id") String productId);
}
