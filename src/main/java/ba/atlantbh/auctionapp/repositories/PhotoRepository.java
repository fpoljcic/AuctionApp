package ba.atlantbh.auctionapp.repositories;

import ba.atlantbh.auctionapp.models.Photo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PhotoRepository extends JpaRepository<Photo, UUID> {
    List<Photo> findAllByProductIdOrderByFeaturedDesc(UUID productId);
}
