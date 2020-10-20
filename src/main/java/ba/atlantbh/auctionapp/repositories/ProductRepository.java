package ba.atlantbh.auctionapp.repositories;

import ba.atlantbh.auctionapp.models.Product;
import ba.atlantbh.auctionapp.projections.FullProductProj;
import ba.atlantbh.auctionapp.projections.ProductCountProj;
import ba.atlantbh.auctionapp.projections.SimpleProductProj;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {

    @Query(value = "SELECT pr.id, pr.name, pr.start_price startPrice, pr.description, p.url, c.name categoryName, s.name subcategoryName " +
                   "FROM product pr LEFT OUTER JOIN photo p on pr.id = p.product_id " +
                   "INNER JOIN subcategory s on s.id = pr.subcategory_id " +
                   "INNER JOIN category c on c.id = s.category_id " +
                   "WHERE pr.featured = true AND (p.featured = true OR p.featured IS NULL) AND start_date <= now() AND end_date > now() " +
                   "ORDER BY RANDOM() LIMIT 6", nativeQuery = true)
    List<SimpleProductProj> getFeaturedRandomProducts();

    @Query(value = "SELECT pr.id, pr.name, pr.start_price startPrice, pr.description, p.url, c.name categoryName, s.name subcategoryName " +
                   "FROM product pr LEFT OUTER JOIN photo p on pr.id = p.product_id " +
                   "INNER JOIN subcategory s on s.id = pr.subcategory_id " +
                   "INNER JOIN category c on c.id = s.category_id " +
                   "WHERE start_date <= now() AND end_date > now() AND (p.featured = true OR p.featured IS NULL) " +
                   "ORDER BY start_date DESC LIMIT 10", nativeQuery = true)
    List<SimpleProductProj> getNewProducts();

    @Query(value = "SELECT pr.id, pr.name, pr.start_price startPrice, pr.description, p.url, c.name categoryName, s.name subcategoryName " +
                   "FROM product pr LEFT OUTER JOIN photo p on pr.id = p.product_id " +
                   "INNER JOIN subcategory s on s.id = pr.subcategory_id " +
                   "INNER JOIN category c on c.id = s.category_id " +
                   "WHERE start_date <= now() AND end_date > now() AND (p.featured = true OR p.featured IS NULL) " +
                   "ORDER BY end_date LIMIT 10", nativeQuery = true)
    List<SimpleProductProj> getLastProducts();

    @Query(value = "SELECT p.id, p.person_id personId, p.name, p.description, p.start_price startPrice, " +
                   "p.start_date startDate, p.end_date endDate, " +
                   "EXISTS(SELECT * FROM wishlist " +
                          "WHERE product_id = :product_id AND person_id = :user_id) wished " +
                   "FROM product p WHERE p.id = :product_id ", nativeQuery = true)
    Optional<FullProductProj> getProduct(@Param("product_id") String productId, @Param("user_id") String userId);

    @Query(value = "SELECT pr.id, pr.name, pr.start_price startPrice, pr.description, p.url, c.name categoryName, s.name subcategoryName " +
                   "FROM product pr LEFT OUTER JOIN photo p on pr.id = p.product_id " +
                   "INNER JOIN subcategory s on s.id = pr.subcategory_id " +
                   "INNER JOIN category c on c.id = s.category_id " +
                   "WHERE (s.id = :subcategory_id OR c.id = :category_id) " +
                   "AND pr.id != :product_id AND (p.featured = true OR p.featured IS NULL) AND start_date <= now() AND end_date > now() " +
                   "ORDER BY s.id = :subcategory_id DESC, RANDOM() LIMIT 4", nativeQuery = true)
    List<SimpleProductProj> getRelatedProducts(@Param("product_id") String productId,
                                               @Param("subcategory_id") String subcategoryId,
                                               @Param("category_id") String categoryId);

    @Query(value = "SELECT pr.id, pr.name, pr.start_price startPrice, pr.description, " +
            "p.url, c.name categoryName, s.name subcategoryName, pr.date_created, " +
            "(SELECT count(id) FROM bid WHERE product_id = pr.id) bids, " +
            "(case when :id = '' then false else EXISTS (SELECT * FROM wishlist WHERE product_id = pr.id AND person_id = :id) end) wished, " +
            "similarity(pr.name, :query) similarity " +
            "FROM product pr LEFT OUTER JOIN photo p on pr.id = p.product_id " +
            "INNER JOIN subcategory s on s.id = pr.subcategory_id " +
            "INNER JOIN category c on c.id = s.category_id " +
            "WHERE (lower(pr.name) LIKE lower('%' || :query || '%') OR pr.name % :query OR " +
            "to_tsvector('english', pr.description) @@ to_tsquery('english', :tsquery)) " +
            "AND (case when :category = '' then true else lower(c.name) = lower(:category) end) " +
            "AND (case when :subcategory = '' then true else lower(s.name) = lower(:subcategory) end) " +
            "AND (p.featured = true OR p.featured IS NULL) AND start_date <= now() AND end_date > now() " +
            "GROUP BY (pr.id, pr.name, pr.start_price, pr.description, p.url, c.name, s.name, pr.date_created)",
            nativeQuery = true)
    Slice<SimpleProductProj> search(String query, String tsquery, String category, String subcategory, String id, Pageable pageable);

    @Query(value = "SELECT c.name categoryName, s.name subcategoryName, count(s.name) " +
            "FROM product pr INNER JOIN subcategory s on s.id = pr.subcategory_id " +
            "INNER JOIN category c on c.id = s.category_id " +
            "WHERE (lower(pr.name) LIKE lower('%' || :query || '%') OR pr.name % :query OR " +
            "to_tsvector('english', pr.description) @@ to_tsquery('english', :tsquery)) " +
            "AND start_date <= now() AND end_date > now() " +
            "GROUP BY ROLLUP (c.name, s.name) ORDER BY (c.name, s.name)",
            nativeQuery = true)
    List<ProductCountProj> searchCount(String query, String tsquery);
}
