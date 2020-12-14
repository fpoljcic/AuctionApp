package ba.atlantbh.auctionapp.repositories;

import ba.atlantbh.auctionapp.models.Product;
import ba.atlantbh.auctionapp.projections.*;
import ba.atlantbh.auctionapp.projections.UserProductProj;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {

    @Query(value = "SELECT * FROM product p " +
            "INNER JOIN person p2 on p2.id = p.person_id " +
            "INNER JOIN subcategory s on s.id = p.subcategory_id " +
            "INNER JOIN category c on c.id = s.category_id " +
            "WHERE p2.active AND p.id = :id", nativeQuery = true)
    Optional<Product> findByIdAndIsActive(String id);

    @Query(value = "SELECT EXISTS (SELECT 1 FROM product p INNER JOIN person p2 on p2.id = p.person_id " +
                   "AND p2.active AND p.id = :id)", nativeQuery = true)
    Boolean existsByIdAndIsActive(String id);

    @Query(value = "SELECT * FROM (SELECT pr.id, pr.name, pr.start_price startPrice, pr.description, p.url, c.name categoryName, s.name subcategoryName, " +
                   "(SELECT COUNT(*) FROM bid b INNER JOIN product p2 on p2.id = b.product_id " +
                   "WHERE b.person_id = :id AND p2.subcategory_id = pr.subcategory_id) count " +
                   "FROM product pr LEFT OUTER JOIN photo p on pr.id = p.product_id " +
                   "INNER JOIN subcategory s on s.id = pr.subcategory_id " +
                   "INNER JOIN category c on c.id = s.category_id INNER JOIN person p3 on pr.person_id = p3.id " +
                   "WHERE (SELECT b2.person_id FROM bid b2 WHERE b2.product_id = pr.id ORDER BY b2.price DESC LIMIT 1) != :id AND " +
                   "pr.featured = :featured AND (p.featured = true OR p.featured IS NULL) AND start_date <= now() AND end_date > now() " +
                   "AND (case when :own then pr.person_id = :id else pr.person_id != :id end) " +
                   "AND p3.active ORDER BY count DESC, RANDOM() LIMIT 18) main ORDER BY RANDOM() LIMIT :limit", nativeQuery = true)
    List<SimpleProductProj> getFeaturedProducts(String id, boolean featured, int limit, boolean own);

    @Query(value = "SELECT pr.id, pr.name, pr.start_price startPrice, pr.description, p.url, c.name categoryName, s.name subcategoryName " +
                   "FROM product pr LEFT OUTER JOIN photo p on pr.id = p.product_id " +
                   "INNER JOIN subcategory s on s.id = pr.subcategory_id " +
                   "INNER JOIN category c on c.id = s.category_id INNER JOIN person p2 on pr.person_id = p2.id " +
                   "WHERE start_date <= now() AND end_date > now() AND (p.featured = true OR p.featured IS NULL) " +
                   "AND p2.active ORDER BY start_date DESC LIMIT 10", nativeQuery = true)
    List<SimpleProductProj> getNewProducts();

    @Query(value = "SELECT pr.id, pr.name, pr.start_price startPrice, pr.description, p.url, c.name categoryName, s.name subcategoryName " +
                   "FROM product pr LEFT OUTER JOIN photo p on pr.id = p.product_id " +
                   "INNER JOIN subcategory s on s.id = pr.subcategory_id " +
                   "INNER JOIN category c on c.id = s.category_id INNER JOIN person p2 on pr.person_id = p2.id " +
                   "WHERE start_date <= now() AND end_date > now() AND (p.featured = true OR p.featured IS NULL) " +
                   "AND p2.active ORDER BY end_date LIMIT 10", nativeQuery = true)
    List<SimpleProductProj> getLastProducts();

    @Query(value = "SELECT p.id, p.person_id personId, p.name, p.description, p.start_price startPrice, " +
                   "p.start_date startDate, p.end_date endDate, " +
                   "EXISTS(SELECT 1 FROM wishlist " +
                          "WHERE product_id = :product_id AND person_id = :user_id) wished " +
                   "FROM product p INNER JOIN person p2 on p.person_id = p2.id " +
                   "WHERE p.id = :product_id AND p2.active", nativeQuery = true)
    Optional<FullProductProj> getProduct(@Param("product_id") String productId, @Param("user_id") String userId);

    @Query(value = "SELECT pr.id, pr.name, pr.start_price startPrice, pr.description, p.url, c.name categoryName, s.name subcategoryName " +
                   "FROM product pr LEFT OUTER JOIN photo p on pr.id = p.product_id " +
                   "INNER JOIN subcategory s on s.id = pr.subcategory_id " +
                   "INNER JOIN category c on c.id = s.category_id INNER JOIN person p2 on pr.person_id = p2.id " +
                   "WHERE (s.id = :subcategory_id OR c.id = :category_id) AND p2.active " +
                   "AND pr.id != :product_id AND (p.featured = true OR p.featured IS NULL) AND start_date <= now() AND end_date > now() " +
                   "ORDER BY s.id = :subcategory_id DESC, RANDOM() LIMIT 4", nativeQuery = true)
    List<SimpleProductProj> getRelatedProducts(@Param("product_id") String productId,
                                               @Param("subcategory_id") String subcategoryId,
                                               @Param("category_id") String categoryId);

    @Query(value = "SELECT pr.id, pr.name, pr.start_price startPrice, pr.description, " +
            "p.url, c.name categoryName, s.name subcategoryName, pr.date_created, " +
            "(SELECT count(b.id) FROM bid b INNER JOIN person p3 on b.person_id = p3.id WHERE b.product_id = pr.id) bids, " +
            "(case when :id = '' then false else EXISTS (SELECT 1 FROM wishlist WHERE product_id = pr.id AND person_id = :id) end) wished, " +
            "similarity(pr.name, :query) similarity " +
            "FROM product pr LEFT OUTER JOIN photo p on pr.id = p.product_id " +
            "INNER JOIN subcategory s on s.id = pr.subcategory_id " +
            "INNER JOIN category c on c.id = s.category_id INNER JOIN person p2 on pr.person_id = p2.id " +
            "WHERE p2.active AND (lower(pr.name) LIKE lower('%' || :query || '%') OR pr.name % :query OR " +
            "to_tsvector('english', pr.name || ' ' || pr.description) @@ to_tsquery('english', :tsquery)) " +
            "AND (case when :category = '' then true else lower(c.name) = lower(:category) end) " +
            "AND (case when :subcategory = '' then true else lower(s.name) = lower(:subcategory) end) " +
            "AND (case when :min_price <= 0 then true else start_price >= :min_price end) " +
            "AND (case when :max_price >= 1000000 then true else start_price <= :max_price end) " +
            "AND (case when :color = '' then true else pr.color = :color end) " +
            "AND (case when :size = '' then true else pr.size = :size end) " +
            "AND (p.featured = true OR p.featured IS NULL) AND start_date <= now() AND end_date > now() " +
            "GROUP BY (pr.id, pr.name, pr.start_price, pr.description, p.url, c.name, s.name, pr.date_created)",
            nativeQuery = true)
    Slice<SimpleProductProj> search(String query, String tsquery, String category, String subcategory, String id,
                                    @Param("min_price") Integer minPrice, @Param("max_price") Integer maxPrice,
                                    String color, String size, Pageable pageable);

    @Query(value = "SELECT EXISTS(SELECT 1 " +
            "FROM product pr INNER JOIN person p2 on pr.person_id = p2.id " +
            "WHERE p2.active AND (lower(pr.name) LIKE lower('%' || :query || '%') OR pr.name % :query OR " +
            "to_tsvector('english', pr.name || ' ' || pr.description) @@ to_tsquery('english', :tsquery)) " +
            "AND start_date <= now() AND end_date > now())",
            nativeQuery = true)
    Boolean searchExists(String query, String tsquery);

    @Query(value = "SELECT c.name categoryName, s.name subcategoryName, count(s.name) " +
            "FROM product pr INNER JOIN subcategory s on s.id = pr.subcategory_id " +
            "INNER JOIN category c on c.id = s.category_id INNER JOIN person p2 on pr.person_id = p2.id " +
            "WHERE p2.active AND (lower(pr.name) LIKE lower('%' || :query || '%') OR pr.name % :query OR " +
            "to_tsvector('english', pr.name || ' ' || pr.description) @@ to_tsquery('english', :tsquery)) " +
            "AND (case when :min_price <= 0 then true else start_price >= :min_price end) " +
            "AND (case when :max_price >= 1000000 then true else start_price <= :max_price end) " +
            "AND (case when :color = '' then true else pr.color = :color end) " +
            "AND (case when :size = '' then true else pr.size = :size end) " +
            "AND start_date <= now() AND end_date > now() " +
            "GROUP BY ROLLUP (c.name, s.name) ORDER BY (c.name, s.name)",
            nativeQuery = true)
    List<ProductCountProj> categoryCount(String query, String tsquery, @Param("min_price") Integer minPrice,
                                         @Param("max_price") Integer maxPrice, String color, String size);

    @Query(value = "SELECT color, count(color) " +
            "FROM product pr " +
            "INNER JOIN subcategory s on s.id = pr.subcategory_id " +
            "INNER JOIN category c on c.id = s.category_id INNER JOIN person p2 on pr.person_id = p2.id " +
            "WHERE p2.active AND (lower(pr.name) LIKE lower('%' || :query || '%') OR pr.name % :query OR " +
            "to_tsvector('english', pr.name || ' ' || pr.description) @@ to_tsquery('english', :tsquery)) " +
            "AND (case when :category = '' then true else lower(c.name) = lower(:category) end) " +
            "AND (case when :subcategory = '' then true else lower(s.name) = lower(:subcategory) end) " +
            "AND (case when :min_price <= 0 then true else start_price >= :min_price end) " +
            "AND (case when :max_price >= 1000000 then true else start_price <= :max_price end) " +
            "AND (case when :size = '' then true else pr.size = :size end) " +
            "AND start_date <= now() AND end_date > now() AND color IS NOT NULL GROUP BY color ORDER BY count(color) DESC",
            nativeQuery = true)
    List<ColorCountProj> colorCount(String query, String tsquery, String category, String subcategory,
                               @Param("min_price") Integer minPrice, @Param("max_price") Integer maxPrice, String size);

    @Query(value = "SELECT pr.size, count(pr.size) " +
            "FROM product pr " +
            "INNER JOIN subcategory s on s.id = pr.subcategory_id " +
            "INNER JOIN category c on c.id = s.category_id INNER JOIN person p2 on pr.person_id = p2.id " +
            "WHERE p2.active AND (lower(pr.name) LIKE lower('%' || :query || '%') OR pr.name % :query OR " +
            "to_tsvector('english', pr.name || ' ' || pr.description) @@ to_tsquery('english', :tsquery)) " +
            "AND (case when :category = '' then true else lower(c.name) = lower(:category) end) " +
            "AND (case when :subcategory = '' then true else lower(s.name) = lower(:subcategory) end) " +
            "AND (case when :min_price <= 0 then true else start_price >= :min_price end) " +
            "AND (case when :max_price >= 1000000 then true else start_price <= :max_price end) " +
            "AND (case when :color = '' then true else pr.color = :color end) " +
            "AND start_date <= now() AND end_date > now() AND pr.size IS NOT NULL GROUP BY pr.size ORDER BY " +
            "CASE WHEN pr.size = 'Small' THEN 0 " +
                 "WHEN pr.size = 'Medium' THEN 1 " +
                 "WHEN pr.size = 'Large' THEN 2 " +
                 "WHEN pr.size = 'Extra_large' THEN 3 ELSE 4 END",
            nativeQuery = true)
    List<SizeCountProj> sizeCount(String query, String tsquery, String category, String subcategory,
                                  @Param("min_price") Integer minPrice, @Param("max_price") Integer maxPrice, String color);

    @Query(value = "SELECT start_price FROM product pr " +
            "INNER JOIN subcategory s on s.id = pr.subcategory_id " +
            "INNER JOIN category c on c.id = s.category_id INNER JOIN person p2 on pr.person_id = p2.id " +
            "WHERE p2.active AND (lower(pr.name) LIKE lower('%' || :query || '%') OR pr.name % :query OR " +
            "to_tsvector('english', pr.name || ' ' || pr.description) @@ to_tsquery('english', :tsquery)) " +
            "AND (case when :category = '' then true else lower(c.name) = lower(:category) end) " +
            "AND (case when :subcategory = '' then true else lower(s.name) = lower(:subcategory) end) " +
            "AND (case when :color = '' then true else pr.color = :color end) " +
            "AND (case when :size = '' then true else pr.size = :size end) " +
            "AND start_date <= now() AND end_date > now() ORDER BY start_price",
            nativeQuery = true)
    List<BigDecimal> prices(String query, String tsquery, String category, String subcategory, String color, String size);

    @Query(value = "SELECT p.id, p.person_id personAddedId, p.name, p2.url, p.start_price price, s.name subcategoryName, c.name categoryName, p.shipping, " +
            "p.start_date startDate, p.end_date endDate, p.date_created defaultSort, (SELECT count(*) FROM bid b2 " +
            "INNER JOIN person p3 on b2.person_id = p3.id WHERE p3.active AND b2.product_id = p.id) bidCount, " +
            "(SELECT max(b2.price) FROM bid b2 INNER JOIN person p4 on b2.person_id = p4.id WHERE p4.active AND b2.product_id = p.id) maxBid, " +
            "(SELECT b2.person_id FROM bid b2 INNER JOIN person p3 on b2.person_id = p3.id WHERE " +
            "(p3.active OR (SELECT EXISTS(SELECT 1 FROM payment pa WHERE pa.product_id = p.id AND pa.person_id = p3.id))) " +
            "AND b2.product_id = p.id ORDER BY b2.price DESC, b2.date LIMIT 1) personId, " +
            "(SELECT EXISTS(SELECT 1 FROM payment pa WHERE pa.product_id = p.id AND pa.person_id != :user_id)) paid " +
            "FROM product p LEFT OUTER JOIN photo p2 on p.id = p2.product_id " +
            "INNER JOIN subcategory s on s.id = p.subcategory_id INNER JOIN category c on c.id = s.category_id "+
            "WHERE p.person_id = :user_id AND (p2.featured = true OR p2.featured IS NULL) " +
            "GROUP BY (p.id, p.person_id, p.name, p2.url, p.start_price, s.name, c.name, p.shipping, p.start_date, p.end_date, p.date_created) " +
            "ORDER BY p.date_created DESC", nativeQuery = true)
    List<UserProductProj> getUserProducts(@Param("user_id") String userId);

    @Query(value = "SELECT p.id, p.person_id personAddedId, p.name, p2.url, max(b.price) price, s.name subcategoryName, c.name categoryName, p.shipping, " +
            "p.start_date startDate, p.end_date endDate, p.end_date defaultSort, (SELECT count(*) FROM bid b2 " +
            "INNER JOIN person p3 on b2.person_id = p3.id WHERE p3.active AND b2.product_id = p.id) bidCount, " +
            "(SELECT b2.person_id FROM bid b2 INNER JOIN person p3 on b2.person_id = p3.id WHERE " +
            "(p3.active OR (SELECT EXISTS(SELECT 1 FROM payment pa WHERE pa.product_id = p.id AND pa.person_id = p3.id))) " +
            "AND b2.product_id = p.id ORDER BY b2.price DESC, b2.date LIMIT 1) personId, " +
            "(SELECT max(b2.price) FROM bid b2 INNER JOIN person p4 on b2.person_id = p4.id WHERE p4.active AND b2.product_id = p.id) maxBid, " +
            "(SELECT EXISTS(SELECT 1 FROM payment pa WHERE pa.product_id = p.id AND pa.person_id = :user_id)) paid " +
            "FROM product p LEFT OUTER JOIN photo p2 on p.id = p2.product_id LEFT OUTER JOIN bid b on p.id = b.product_id " +
            "INNER JOIN subcategory s on s.id = p.subcategory_id INNER JOIN category c on c.id = s.category_id " +
            "INNER JOIN person ps on p.person_id = ps.id WHERE ps.active AND " +
            "b.person_id = :user_id AND (p2.featured = true OR p2.featured IS NULL) " +
            "GROUP BY (p.id, p.person_id, p.name, p2.url, s.name, c.name, p.shipping, p.start_date, p.end_date) " +
            "ORDER BY p.end_date", nativeQuery = true)
    List<UserProductProj> getUserBidProducts(@Param("user_id") String userId);

    @Query(value = "SELECT p.id, p.person_id personAddedId, p.name, p2.url, max(b.price) price, s.name subcategoryName, c.name categoryName, p.shipping, " +
            "p.start_date startDate, p.end_date endDate, w.date defaultSort, (SELECT count(*) FROM bid b2 " +
            "INNER JOIN person p3 on b2.person_id = p3.id WHERE p3.active AND b2.product_id = p.id) bidCount, " +
            "(SELECT b2.person_id FROM bid b2 INNER JOIN person p3 on b2.person_id = p3.id WHERE " +
            "(p3.active OR (SELECT EXISTS(SELECT 1 FROM payment pa WHERE pa.product_id = p.id AND pa.person_id = p3.id))) " +
            "AND b2.product_id = p.id ORDER BY b2.price DESC, b2.date LIMIT 1) personId, " +
            "(SELECT max(b2.price) FROM bid b2 INNER JOIN person p3 on b2.person_id = p3.id WHERE p3.active AND b2.product_id = p.id) maxBid, " +
            "(SELECT EXISTS(SELECT 1 FROM payment pa WHERE pa.product_id = p.id AND pa.person_id = :user_id)) paid " +
            "FROM product p LEFT OUTER JOIN photo p2 on p.id = p2.product_id LEFT OUTER JOIN bid b on p.id = b.product_id " +
            "INNER JOIN subcategory s on s.id = p.subcategory_id INNER JOIN category c on c.id = s.category_id " +
            "INNER JOIN wishlist w on p.id = w.product_id INNER JOIN person ps on p.person_id = ps.id " +
            "WHERE ps.active AND w.person_id = :user_id AND (p2.featured = true OR p2.featured IS NULL) " +
            "GROUP BY (p.id, p.person_id, p.name, p2.url, s.name, c.name, p.shipping, p.start_date, p.end_date, w.date) " +
            "ORDER BY w.date DESC", nativeQuery = true)
    List<UserProductProj> getUserWishlistProducts(@Param("user_id") String userId);

    @Query(value = "SELECT p.id productId, p.name productName, " +
            "(SELECT max(b2.price) FROM bid b2 INNER JOIN person p5 on b2.person_id = p5.id WHERE p5.active AND b2.product_id = p.id) maxBid, " +
            "(SELECT p2.email FROM bid b2 INNER JOIN person p2 on p2.id = b2.person_id WHERE b2.product_id = p.id " +
            "AND p2.active ORDER BY b2.price DESC, b2.date LIMIT 1) email," +
            "(SELECT p3.push_notify FROM bid b3 INNER JOIN person p3 on p3.id = b3.person_id WHERE b3.product_id = p.id " +
            "AND p3.active ORDER BY b3.price DESC, b3.date LIMIT 1) pushNotify, " +
            "(SELECT p4.email_notify FROM bid b4 INNER JOIN person p4 on p4.id = b4.person_id WHERE b4.product_id = p.id " +
            "AND p4.active ORDER BY b4.price DESC, b4.date LIMIT 1) emailNotify " +
            "FROM product p INNER JOIN bid b on p.id = b.product_id INNER JOIN person p2 on p.person_id = p2.id " +
            "WHERE end_date <= now() AND NOT notified AND NOT EXISTS (SELECT 1 FROM payment p3 WHERE p3.product_id = p.id) " +
            "AND (SELECT EXISTS(SELECT 1 FROM bid b5 INNER JOIN person p5 on p5.id = b5.person_id WHERE b5.product_id = p.id AND p5.active)) " +
            "AND p2.active GROUP BY (p.id, p.name)", nativeQuery = true)
    List<WinnerProj> getNotNotifiedWinners();

    @Query(value = "SELECT * FROM product p WHERE p.end_date <= now() AND " +
            "NOT (SELECT EXISTS(SELECT 1 FROM payment pa WHERE pa.product_id = p.id)) AND " +
            "(SELECT b2.person_id FROM bid b2 WHERE b2.product_id = p.id ORDER BY b2.price DESC, b2.date LIMIT 1) = :user_id", nativeQuery = true)
    List<Product> getNotPaidProducts(@Param("user_id") String userId);
}
