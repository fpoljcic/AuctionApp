package ba.atlantbh.auctionapp.repositories;

import ba.atlantbh.auctionapp.models.Token;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TokenRepository extends JpaRepository<Token, UUID> {
}
