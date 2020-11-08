package ba.atlantbh.auctionapp.services;

import ba.atlantbh.auctionapp.exceptions.BadRequestException;
import ba.atlantbh.auctionapp.exceptions.ConflictException;
import ba.atlantbh.auctionapp.exceptions.UnauthorizedException;
import ba.atlantbh.auctionapp.models.Card;
import ba.atlantbh.auctionapp.models.Person;
import ba.atlantbh.auctionapp.repositories.CardRepository;
import ba.atlantbh.auctionapp.repositories.PersonRepository;
import ba.atlantbh.auctionapp.requests.CardRequest;
import ba.atlantbh.auctionapp.requests.LoginRequest;
import ba.atlantbh.auctionapp.requests.RegisterRequest;
import ba.atlantbh.auctionapp.requests.UpdateProfileRequest;
import ba.atlantbh.auctionapp.security.JwtTokenUtil;
import ba.atlantbh.auctionapp.utilities.UpdateMapper;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
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
        if (!person.getEmail().equals(updateProfileRequest.getEmail())
                && personRepository.existsByEmail(updateProfileRequest.getEmail()))
            throw new ConflictException("Email already in use");
        updateCard(updateProfileRequest.getCard(), person);
        updateMapper.updatePerson(updateProfileRequest, person);
        setBlankPropsToNull(person);
        Person savedPerson = personRepository.save(person);
        savedPerson.setPassword(null);
        return savedPerson;
    }

    private void updateCard(CardRequest updatedCard, Person person) {
        if (updatedCard != null) {
            Card card = cardRepository.findByPersonId(person.getId()).orElse(new Card(person));
            String maskedCardNumber = card.getMaskedCardNumber();
            if (maskedCardNumber != null && maskedCardNumber.equals(updatedCard.getCardNumber()))
                updatedCard.setCardNumber(card.getCardNumber());
            else if (!updatedCard.getCardNumber().matches("^(\\d*)$"))
                throw new BadRequestException("Card number can only contain digits");
            updateMapper.updateCard(updatedCard, card);
            cardRepository.save(card);
        } else {
            List<Card> cards = cardRepository.findAllByPersonId(person.getId());
            for (Card card : cards) {
                card.setPerson(null);
                cardRepository.save(card);
            }
        }
    }

    private void setBlankPropsToNull(Person person) {
        if (person.getStreet().equals(""))
            person.setStreet(null);
        if (person.getCountry().equals(""))
            person.setCountry(null);
        if (person.getCity().equals(""))
            person.setCity(null);
        if (person.getState().equals(""))
            person.setState(null);
        if (person.getZip().equals(""))
            person.setZip(null);
    }
}
