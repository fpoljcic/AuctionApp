package ba.atlantbh.auctionapp.repositories;

import ba.atlantbh.auctionapp.models.Card;
import ba.atlantbh.auctionapp.models.Person;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CardRepository extends JpaRepository<Card, UUID> {
    Optional<Card> findByNameAndCardNumberAndExpirationYearAndExpirationMonthAndCvcAndPerson(String name, String cardNumber,
                                                                                             Integer expirationYear,
                                                                                             Integer expirationMonth,
                                                                                             Short cvc, Person person);

    Optional<Card> findByCardNumberAndCvcAndPerson(String cardNumber, Short cvc, Person person);

    Optional<Card> findByPersonIdAndSavedIsTrue(UUID personId);
}
