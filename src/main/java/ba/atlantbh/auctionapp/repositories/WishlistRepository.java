package ba.atlantbh.auctionapp.repositories;

import ba.atlantbh.auctionapp.models.Person;
import ba.atlantbh.auctionapp.models.Product;
import ba.atlantbh.auctionapp.models.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface WishlistRepository extends JpaRepository<Wishlist, UUID> {

    Optional<Wishlist> findByPersonAndProduct(Person person, Product product);

    Boolean existsByPersonAndProduct(Person person, Product product);
}
