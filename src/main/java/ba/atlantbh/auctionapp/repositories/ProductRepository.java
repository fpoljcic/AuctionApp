package ba.atlantbh.auctionapp.repositories;

import ba.atlantbh.auctionapp.models.Product;
import ba.atlantbh.auctionapp.responses.SimpleProductResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {

    @Query(value = "SELECT pr.id, pr.name, pr.start_price startPrice, pr.description, p.url, c.name categoryName, s.name subcategoryName " +
                   "FROM product pr INNER JOIN photo p on pr.id = p.product_id " +
                   "INNER JOIN subcategory s on s.id = pr.subcategory_id " +
                   "INNER JOIN category c on c.id = s.category_id " +
                   "WHERE pr.featured = true AND p.featured = true AND start_date <= now() AND end_date > now() " +
                   "ORDER BY RANDOM() LIMIT 6", nativeQuery = true)
    List<SimpleProductResponse> getFeaturedRandomProducts();

    @Query(value = "SELECT pr.id, pr.name, pr.start_price startPrice, pr.description, p.url, c.name categoryName, s.name subcategoryName " +
                   "FROM product pr INNER JOIN photo p on pr.id = p.product_id " +
                   "INNER JOIN subcategory s on s.id = pr.subcategory_id " +
                   "INNER JOIN category c on c.id = s.category_id " +
                   "WHERE start_date <= now() AND end_date > now() AND p.featured = true " +
                   "ORDER BY start_date DESC LIMIT 10", nativeQuery = true)
    List<SimpleProductResponse> getNewProducts();

    @Query(value = "SELECT pr.id, pr.name, pr.start_price startPrice, pr.description, p.url, c.name categoryName, s.name subcategoryName " +
                   "FROM product pr INNER JOIN photo p on pr.id = p.product_id " +
                   "INNER JOIN subcategory s on s.id = pr.subcategory_id " +
                   "INNER JOIN category c on c.id = s.category_id " +
                   "WHERE start_date <= now() AND end_date > now() AND p.featured = true " +
                   "ORDER BY end_date LIMIT 10", nativeQuery = true)
    List<SimpleProductResponse> getLastProducts();
}
