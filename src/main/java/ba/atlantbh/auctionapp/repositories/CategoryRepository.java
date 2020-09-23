package ba.atlantbh.auctionapp.repositories;

import ba.atlantbh.auctionapp.models.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CategoryRepository extends JpaRepository<Category, UUID> {
}
