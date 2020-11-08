package ba.atlantbh.auctionapp.repositories;

import ba.atlantbh.auctionapp.models.Card;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CardRepository extends JpaRepository<Card, UUID> {
    Optional<Card> findByNameAndCardNumberAndExpirationYearAndExpirationMonthAndCvc(String name, String cardNumber,
                                                                                    Integer expirationYear,
                                                                                    Integer expirationMonth,
                                                                                    Short cvc);
    Optional<Card> findByPersonId(UUID personId);

    List<Card> findAllByPersonId(UUID personId);
}
