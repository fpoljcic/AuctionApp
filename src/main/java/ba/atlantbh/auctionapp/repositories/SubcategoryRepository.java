package ba.atlantbh.auctionapp.repositories;

import ba.atlantbh.auctionapp.models.Subcategory;
import ba.atlantbh.auctionapp.responses.EssentialSubcategoryInfoResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface SubcategoryRepository extends JpaRepository<Subcategory, UUID> {

    @Query(value = "SELECT sc.id, sc.name, c.name categoryName, ph.url, min(start_price) startPrice " +
                   "FROM subcategory sc INNER JOIN category c on c.id = sc.category_id " +
                   "INNER JOIN product p on sc.id = p.subcategory_id INNER JOIN photo ph on p.id = ph.product_id " +
                   "GROUP BY (sc.id, sc.name, c.name, ph.url) ORDER BY RANDOM() LIMIT 4", nativeQuery = true)
    List<EssentialSubcategoryInfoResponse> getRandomSubcategories();
}
