package ba.atlantbh.auctionapp.repositories;

import ba.atlantbh.auctionapp.models.Person;
import ba.atlantbh.auctionapp.projections.PersonInfoProj;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.UUID;

public interface PersonRepository extends JpaRepository<Person, UUID> {
    boolean existsByEmail(String email);

    Optional<Person> findByEmail(String email);

    Optional<Person> findByEmailAndActiveIsTrue(String email);

    Optional<Person> findByIdAndActiveIsTrue(UUID id);

    @Query(value = "SELECT p.first_name || ' ' || p.last_name as name, p.photo, p.rating FROM person p " +
                   "WHERE p.active AND id = :id", nativeQuery = true)
    Optional<PersonInfoProj> getUserInfo(String id);

    boolean existsByIdAndActiveIsTrue(UUID id);
}
