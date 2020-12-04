package ba.atlantbh.auctionapp.services;

import ba.atlantbh.auctionapp.exceptions.BadGatewayException;
import ba.atlantbh.auctionapp.exceptions.BadRequestException;
import ba.atlantbh.auctionapp.exceptions.ConflictException;
import ba.atlantbh.auctionapp.exceptions.UnauthorizedException;
import ba.atlantbh.auctionapp.models.Card;
import ba.atlantbh.auctionapp.models.Person;
import ba.atlantbh.auctionapp.models.Token;
import ba.atlantbh.auctionapp.projections.PersonInfoProj;
import ba.atlantbh.auctionapp.repositories.CardRepository;
import ba.atlantbh.auctionapp.repositories.PersonRepository;
import ba.atlantbh.auctionapp.repositories.TokenRepository;
import ba.atlantbh.auctionapp.requests.*;
import ba.atlantbh.auctionapp.security.JwtTokenUtil;
import ba.atlantbh.auctionapp.utilities.UpdateMapper;
import com.stripe.exception.StripeException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static ba.atlantbh.auctionapp.utilities.ResourceUtil.getResourceFileAsString;

@RequiredArgsConstructor
@Service
public class PersonService {

    private final PersonRepository personRepository;
    private final CardRepository cardRepository;
    private final TokenRepository tokenRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final UpdateMapper updateMapper;
    private final StripeService stripeService;

    private String hostUrl;

    @Value("${app.hostUrl}")
    public void setHostUrl(String hostUrl) {
        this.hostUrl = hostUrl;
    }

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
        try {
            stripeService.updateCustomer(person);
        } catch (StripeException ignore) {
        }
        Person savedPerson = personRepository.save(person);
        savedPerson.setPassword(null);
        return savedPerson;
    }

    private void updateCard(CardRequest updatedCard, Person person) {
        if (updatedCard != null) {
            Card oldCard = cardRepository.findByPersonId(person.getId()).orElse(new Card(person));
            String maskedCardNumber = oldCard.getMaskedCardNumber();
            if (maskedCardNumber != null && maskedCardNumber.equals(updatedCard.getCardNumber()))
                updatedCard.setCardNumber(oldCard.getCardNumber());
            else if (!updatedCard.getCardNumber().matches("^(\\d*)$"))
                throw new BadRequestException("Card number can only contain digits");
            boolean createNewCard = false;
            if (!updatedCard.getCardNumber().equals(oldCard.getCardNumber()) || !updatedCard.getCvc().equals(oldCard.getCvc()))
                createNewCard = true;
            Card newCard = new Card();
            updateMapper.updateCard(updatedCard, newCard);
            newCard.setStripeCardId(oldCard.getStripeCardId());
            String stripeCardId;
            try {
                if (createNewCard)
                    stripeCardId = stripeService.saveCard(newCard, person, true);
                else
                    stripeCardId = stripeService.updateCard(newCard, person);
            } catch (StripeException e) {
                throw new BadRequestException(e.getStripeError().getMessage());
            }
            if (createNewCard) {
                newCard.setPerson(person);
                newCard.setStripeCardId(stripeCardId);
                if (oldCard.getId() == null) {
                    cardRepository.save(newCard);
                    return;
                }
                oldCard.setPerson(null);
                List<Card> cards = Arrays.asList(oldCard, newCard);
                cardRepository.saveAll(cards);
                return;
            }
            updateMapper.updateCard(updatedCard, oldCard);
            cardRepository.save(oldCard);
        } else {
            List<Card> cards = cardRepository.findAllByPersonId(person.getId());
            for (Card card : cards) {
                card.setPerson(null);
                cardRepository.save(card);
            }
        }
    }

    private void setBlankPropsToNull(Person person) {
        if (person.getStreet() != null && person.getStreet().equals(""))
            person.setStreet(null);
        if (person.getCountry() != null && person.getCountry().equals(""))
            person.setCountry(null);
        if (person.getCity() != null && person.getCity().equals(""))
            person.setCity(null);
        if (person.getState() != null && person.getState().equals(""))
            person.setState(null);
        if (person.getZip() != null && person.getZip().equals(""))
            person.setZip(null);
    }

    public String forgotPassword(ForgotPassRequest forgotPassRequest) {
        String message = "We sent you an email with a link to reset your password. " +
                "The link will expire after 24 hours.";
        Optional<Person> personOptional = personRepository.findByEmail(forgotPassRequest.getEmail());
        if (personOptional.isEmpty())
            return message;
        Person person = personOptional.get();
        if (tokenRepository.existsByPerson(person.getId().toString()))
            return "We have already sent you an email with a link to reset your password " +
                    "in the last 24 hours. Please check your inbox.";
        UUID uuid = UUID.randomUUID();
        String body = formEmailBody(hostUrl, uuid);
        try {
            emailService.sendMail(person.getEmail(), "Password reset", body);
        } catch (MessagingException e) {
            throw new BadGatewayException("We have issues sending you an email");
        }
        Token token = new Token(uuid, person);
        tokenRepository.save(token);
        return message;
    }

    private String formEmailBody(String hostUrl, UUID uuid) {
        String body = getResourceFileAsString("static/mail.html");
        return body.replace("hostUrl", hostUrl + "/reset_password?token=" + uuid);
    }

    public String resetPassword(ResetPassRequest resetPassRequest) {
        Token token = tokenRepository.getToken(resetPassRequest.getToken().toString())
                .orElseThrow(() -> new BadRequestException("Invalid token"));
        Person person = personRepository.findById(token.getPerson().getId())
                .orElseThrow(() -> new BadRequestException("Invalid token"));

        person.setPassword(passwordEncoder.encode(resetPassRequest.getPassword()));
        personRepository.save(person);

        token.setUsed(true);
        tokenRepository.save(token);

        return "You have changed your password";
    }

    public Boolean validToken(TokenRequest tokenRequest) {
        Token token = tokenRepository.getToken(tokenRequest.getToken())
                .orElse(new Token());
        return token.getId() != null && personRepository.existsById(token.getPerson().getId());
    }

    public PersonInfoProj getUserInfo(String userId) {
        return personRepository.getUserInfo(userId)
                .orElseThrow(() -> new BadRequestException("Wrong person id"));
    }

    public void updateNotifications(UpdateNotifRequest updateNotifRequest) {
        UUID personId = JwtTokenUtil.getRequestPersonId();
        Person person = personRepository.findById(personId)
                .orElseThrow(() -> new UnauthorizedException("Wrong person id"));

        if (updateNotifRequest.getEmailNotify() == null && updateNotifRequest.getPushNotify() == null)
            throw new BadRequestException("You must supply emailNotify or pushNotify attributes");

        if (updateNotifRequest.getEmailNotify() != null)
            person.setEmailNotify(updateNotifRequest.getEmailNotify());
        if (updateNotifRequest.getPushNotify() != null)
            person.setPushNotify(updateNotifRequest.getPushNotify());

        personRepository.save(person);
    }
}
