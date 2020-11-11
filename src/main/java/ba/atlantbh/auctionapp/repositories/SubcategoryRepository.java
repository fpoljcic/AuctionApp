package ba.atlantbh.auctionapp.repositories;

import ba.atlantbh.auctionapp.models.Category;
import ba.atlantbh.auctionapp.models.Subcategory;
import ba.atlantbh.auctionapp.projections.SimpleSubcategoryProj;
import ba.atlantbh.auctionapp.projections.SubcategoryProj;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface SubcategoryRepository extends JpaRepository<Subcategory, UUID> {

    @Query(value = "SELECT * FROM (SELECT sc.id, sc.name, c.name categoryName, sc.photo_url url, min(start_price) startPrice, " +
                   "(SELECT COUNT(*) FROM bid b INNER JOIN product p2 on p2.id = b.product_id " +
                   "WHERE b.person_id = :id AND p2.subcategory_id = sc.id) count " +
                   "FROM subcategory sc INNER JOIN category c on c.id = sc.category_id " +
                   "INNER JOIN product p on sc.id = p.subcategory_id " +
                   "WHERE p.start_date <= now() AND p.end_date > now() " +
                   "GROUP BY (sc.id, sc.name, c.name, sc.photo_url) ORDER BY count DESC, RANDOM() LIMIT 12) main " +
                   "ORDER BY RANDOM() LIMIT 4", nativeQuery = true)
    List<SubcategoryProj> getFeaturedSubcategories(String id);

    List<SimpleSubcategoryProj> findAllByCategory(Category category);
}
