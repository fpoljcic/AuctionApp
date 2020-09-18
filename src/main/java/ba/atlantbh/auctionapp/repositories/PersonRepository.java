package ba.atlantbh.auctionapp.repositories;

import ba.atlantbh.auctionapp.models.Person;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PersonRepository extends JpaRepository<Person, UUID> {
    boolean existsByEmail(String email);

    Person findByEmail(String email);
}
