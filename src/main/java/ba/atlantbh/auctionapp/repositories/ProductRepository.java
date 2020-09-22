package ba.atlantbh.auctionapp.repositories;

import ba.atlantbh.auctionapp.models.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {

    @Query(value = "SELECT * FROM product WHERE featured = true AND start_date <= now() AND end_date > now() ORDER BY RANDOM() LIMIT 4", nativeQuery = true)
    List<Product> getFeaturedRandomProducts();

    @Query(value = "SELECT * FROM product WHERE start_date <= now() AND end_date > now() ORDER BY start_date DESC LIMIT 8", nativeQuery = true)
    List<Product> getNewProducts();

    @Query(value = "SELECT * FROM product WHERE start_date <= now() AND end_date > now() ORDER BY end_date LIMIT 8", nativeQuery = true)
    List<Product> getLastProducts();
}
