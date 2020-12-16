package ba.atlantbh.auctionapp.repositories;

import ba.atlantbh.auctionapp.models.Category;
import ba.atlantbh.auctionapp.projections.CategoryProj;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface CategoryRepository extends JpaRepository<Category, UUID> {

    @Query(value = "SELECT c.id, c.name, count(*) FILTER (WHERE start_date <= now() AND end_date > now()) " +
            "FROM category c left outer join subcategory s on c.id = s.category_id " +
            "left outer join product p on s.id = p.subcategory_id " +
            "GROUP BY (c.id, c.name) ORDER BY c.name", nativeQuery = true)
    List<CategoryProj> getAll();
}
