package ba.atlantbh.auctionapp.repositories;

import ba.atlantbh.auctionapp.models.Subcategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface SubcategoryRepository extends JpaRepository<Subcategory, UUID> {

    @Query(value = "SELECT * FROM subcategory ORDER BY RANDOM() LIMIT 3", nativeQuery = true)
    List<Subcategory> getRandomSubcategories();
}
