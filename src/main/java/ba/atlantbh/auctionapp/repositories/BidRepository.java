package ba.atlantbh.auctionapp.repositories;

import ba.atlantbh.auctionapp.models.Bid;
import ba.atlantbh.auctionapp.responses.SimpleBidResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface BidRepository extends JpaRepository<Bid, UUID> {

    @Query(value = "SELECT b.id, p.first_name firstName, p.last_name lastName, p.photo, b.date, b.price, b.person_id personId FROM bid b " +
                   "INNER JOIN person p on p.id = b.person_id WHERE b.product_id = :id ORDER BY b.price DESC, b.date", nativeQuery = true)
    List<SimpleBidResponse> getBidsForProduct(String id);

    @Query(value = "SELECT MAX(price) FROM bid WHERE person_id = :person_id AND product_id = :product_id", nativeQuery = true)
    Float getMaxBidFromPersonForProduct(@Param("person_id") String personId, @Param("product_id") String productId);
}
