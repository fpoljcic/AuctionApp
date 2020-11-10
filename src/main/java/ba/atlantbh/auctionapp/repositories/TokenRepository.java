package ba.atlantbh.auctionapp.repositories;

import ba.atlantbh.auctionapp.models.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.UUID;

public interface TokenRepository extends JpaRepository<Token, UUID> {

    @Query(value = "SELECT * FROM token t WHERE t.token = :query " +
            "AND now() <= (date_created + INTERVAL '24 hour') AND NOT used",
            nativeQuery = true)
    Optional<Token> getToken(String query);

    @Query(value = "SELECT EXISTS(SELECT 1 FROM token t WHERE person_id = :personId " +
            "AND now() <= (date_created + INTERVAL '24 hour') AND NOT used)",
            nativeQuery = true)
    Boolean existsByPerson(String personId);
}
