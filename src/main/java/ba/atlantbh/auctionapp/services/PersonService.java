package ba.atlantbh.auctionapp.services;

import ba.atlantbh.auctionapp.exceptions.ConflictException;
import ba.atlantbh.auctionapp.exceptions.UnauthorizedException;
import ba.atlantbh.auctionapp.models.Person;
import ba.atlantbh.auctionapp.repositories.PersonRepository;
import ba.atlantbh.auctionapp.requests.LoginRequest;
import ba.atlantbh.auctionapp.requests.RegisterRequest;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class PersonService {

    private final PersonRepository personRepository;
    private final PasswordEncoder passwordEncoder;

    public Person register(RegisterRequest registerRequest) {
        if (personRepository.existsByEmail(registerRequest.getEmail()))
            throw new ConflictException("Email already in use");
        Person person = personRepository.save(new Person(
                registerRequest.getFirstName(),
                registerRequest.getLastName(),
                registerRequest.getEmail(),
                passwordEncoder.encode(registerRequest.getPassword()))
        );
        person.setPassword(null); // No need to return password
        return person;
    }

    public Person login(LoginRequest loginRequest) {
        Person person = personRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Wrong email or password"));
        if (!passwordEncoder.matches(loginRequest.getPassword(), person.getPassword()))
            throw new UnauthorizedException("Wrong email or password");
        if (!person.getActive())
            throw new UnauthorizedException("User account disabled");
        person.setPassword(null); // No need to return password
        return person;
    }
}
