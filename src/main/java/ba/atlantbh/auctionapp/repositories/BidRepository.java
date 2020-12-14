package ba.atlantbh.auctionapp.repositories;

import ba.atlantbh.auctionapp.models.Bid;
import ba.atlantbh.auctionapp.projections.BidderProj;
import ba.atlantbh.auctionapp.projections.SimpleBidProj;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BidRepository extends JpaRepository<Bid, UUID> {

    @Query(value = "SELECT b.id, p.first_name || ' ' || p.last_name as name, p.photo, b.date, b.price, b.person_id personId FROM bid b " +
                   "INNER JOIN person p on p.id = b.person_id WHERE p.active AND b.product_id = :id ORDER BY b.price DESC, b.date", nativeQuery = true)
    List<SimpleBidProj> getBidsForProduct(String id);

    @Query(value = "SELECT MAX(price) FROM bid b INNER JOIN person p on p.id = b.person_id " +
            "WHERE p.active AND b.person_id = :person_id AND b.product_id = :product_id", nativeQuery = true)
    BigDecimal getMaxBidFromPersonForProduct(@Param("person_id") String personId, @Param("product_id") String productId);

    @Query(value = "SELECT * FROM bid b INNER JOIN person p on p.id = b.person_id " +
            "WHERE p.active AND b.product_id = :product_id ORDER BY b.price DESC, b.date LIMIT 1", nativeQuery = true)
    Optional<Bid> getHighestBidForProduct(@Param("product_id") String productId);

    @Query(value = "SELECT p.email, p.email_notify emailNotify, p.push_notify pushNotify, b.price maxBid " +
            "FROM bid b INNER JOIN person p on b.person_id = p.id " +
            "WHERE p.active AND product_id = :product_id ORDER BY b.price DESC, b.date LIMIT 1", nativeQuery = true)
    Optional<BidderProj> getHighestBidder(@Param("product_id") String productId);
}
