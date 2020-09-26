package ba.atlantbh.auctionapp.repositories;

import ba.atlantbh.auctionapp.models.Bid;
import ba.atlantbh.auctionapp.responses.SimpleBidResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface BidRepository extends JpaRepository<Bid, UUID> {

    @Query(value = "SELECT b.id, p.first_name firstName, p.last_name lastName, p.photo, b.date, b.price FROM bid b " +
                   "INNER JOIN person p on p.id = b.person_id WHERE b.product_id = :id ORDER BY b.price DESC", nativeQuery = true)
    List<SimpleBidResponse> getBidsForProduct(String id);
}
