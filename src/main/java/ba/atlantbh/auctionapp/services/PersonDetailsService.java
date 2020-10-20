package ba.atlantbh.auctionapp.services;

import ba.atlantbh.auctionapp.exceptions.NotFoundException;
import ba.atlantbh.auctionapp.models.Person;
import ba.atlantbh.auctionapp.repositories.PersonRepository;
import ba.atlantbh.auctionapp.security.PersonDetails;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class PersonDetailsService implements UserDetailsService {

    private final PersonRepository personRepository;

    @Override
    public PersonDetails loadUserByUsername(String email) {
        Person person = personRepository.findByEmail(email).orElseThrow(NotFoundException::new);
        return new PersonDetails(person);
    }
}
