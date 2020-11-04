package ba.atlantbh.auctionapp.services;

import ba.atlantbh.auctionapp.exceptions.BadRequestException;
import ba.atlantbh.auctionapp.exceptions.ConflictException;
import ba.atlantbh.auctionapp.exceptions.UnauthorizedException;
import ba.atlantbh.auctionapp.models.Card;
import ba.atlantbh.auctionapp.models.Person;
import ba.atlantbh.auctionapp.repositories.CardRepository;
import ba.atlantbh.auctionapp.repositories.PersonRepository;
import ba.atlantbh.auctionapp.requests.LoginRequest;
import ba.atlantbh.auctionapp.requests.RegisterRequest;
import ba.atlantbh.auctionapp.requests.UpdateProfileRequest;
import ba.atlantbh.auctionapp.security.JwtTokenUtil;
import ba.atlantbh.auctionapp.utilities.UpdateMapper;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@AllArgsConstructor
@Service
public class PersonService {

    private final PersonRepository personRepository;
    private final CardRepository cardRepository;
    private final PasswordEncoder passwordEncoder;
    private final UpdateMapper updateMapper;

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

    public Person update(UpdateProfileRequest updateProfileRequest) {
        if (updateProfileRequest.getDateOfBirth().isAfter(LocalDateTime.now()))
            throw new BadRequestException("Date of birth can't be after current date");
        UUID personId = JwtTokenUtil.getRequestPersonId();
        Person person = personRepository.findById(personId)
                .orElseThrow(() -> new UnauthorizedException("Wrong person id"));
        if (updateProfileRequest.getCard() != null) {
            Card card = cardRepository.findByPersonId(person.getId()).orElse(new Card(person));
            String maskedCardNumber = card.getMaskedCardNumber();
            if (maskedCardNumber != null && maskedCardNumber.equals(updateProfileRequest.getCard().getCardNumber()))
                updateProfileRequest.getCard().setCardNumber(card.getCardNumber());
            else if (!updateProfileRequest.getCard().getCardNumber().matches("^(\\d*)$"))
                throw new BadRequestException("Card number can only contain digits");
            updateMapper.updateCard(updateProfileRequest.getCard(), card);
            cardRepository.save(card);
        }
        updateMapper.updatePerson(updateProfileRequest, person);
        return personRepository.save(person);
    }
}
