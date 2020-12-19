package ba.atlantbh.auctionapp.services;

import ba.atlantbh.auctionapp.exceptions.BadGatewayException;
import ba.atlantbh.auctionapp.exceptions.BadRequestException;
import ba.atlantbh.auctionapp.exceptions.ConflictException;
import ba.atlantbh.auctionapp.exceptions.UnauthorizedException;
import ba.atlantbh.auctionapp.models.Card;
import ba.atlantbh.auctionapp.models.Person;
import ba.atlantbh.auctionapp.models.Product;
import ba.atlantbh.auctionapp.models.Token;
import ba.atlantbh.auctionapp.projections.PersonInfoProj;
import ba.atlantbh.auctionapp.repositories.*;
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
    private final ProductRepository productRepository;
    private final CardRepository cardRepository;
    private final TokenRepository tokenRepository;
    private final NotificationRepository notificationRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final UpdateMapper updateMapper;
    private final StripeService stripeService;
    private final SocialService socialService;

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
            throw new UnauthorizedException("User account is deactivated");
        person.setPassword(null); // No need to return password
        return person;
    }

    public Person socialLogin(SocialLoginRequest socialLoginRequest) {
        if (socialLoginRequest.getType() == null)
            throw new BadRequestException("Type is required (e.g. Facebook or Google)");

        if (!socialService.validToken(socialLoginRequest.getType(), socialLoginRequest.getId(), socialLoginRequest.getToken()))
            throw new UnauthorizedException("Invalid token");

        Person person = personRepository.findByEmail(socialLoginRequest.getEmail())
                .orElse(new Person());

        if (person.getId() == null) {
            if (socialLoginRequest.getFirstName() == null || socialLoginRequest.getLastName() == null)
                throw new BadRequestException("New users need to have a first and last name");

            person.setEmail(socialLoginRequest.getEmail());
            person.setFirstName(socialLoginRequest.getFirstName());
            person.setLastName(socialLoginRequest.getLastName());
            String profilePicUrl = socialService.getProfilePicUrl(
                    socialLoginRequest.getType(),
                    socialLoginRequest.getId(),
                    socialLoginRequest.getToken()
            );
            person.setPhoto(profilePicUrl);
            person = personRepository.save(person);
        }

        person.setPassword(null);
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
            cardRepository.findByCardNumberAndCvcAndPerson(
                    updatedCard.getCardNumber(),
                    updatedCard.getCvc(),
                    person
            ).ifPresentOrElse(oldCard -> {
                updateMapper.updateCard(updatedCard, oldCard);
                oldCard.setSaved(true);
                try {
                    stripeService.updateCard(oldCard, person);
                } catch (StripeException e) {
                    throw new BadRequestException(e.getStripeError().getMessage());
                }
                cardRepository.save(oldCard);
            }, () -> {
                Card savedCard = cardRepository.findByPersonIdAndSavedIsTrue(person.getId()).orElse(new Card(person));
                String maskedCardNumber = savedCard.getMaskedCardNumber();
                if (maskedCardNumber != null && maskedCardNumber.equals(updatedCard.getCardNumber()))
                    updatedCard.setCardNumber(savedCard.getCardNumber());
                else if (!updatedCard.getCardNumber().matches("^(\\d*)$"))
                    throw new BadRequestException("Card number can only contain digits");
                boolean createNewCard = false;
                if (!updatedCard.getCardNumber().equals(savedCard.getCardNumber()) || !updatedCard.getCvc().equals(savedCard.getCvc()))
                    createNewCard = true;
                Card newCard = new Card();
                updateMapper.updateCard(updatedCard, newCard);
                newCard.setStripeCardId(savedCard.getStripeCardId());
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
                    newCard.setSaved(true);
                    newCard.setStripeCardId(stripeCardId);
                    if (savedCard.getId() == null) {
                        cardRepository.save(newCard);
                        return;
                    }
                    savedCard.setSaved(false);
                    List<Card> cards = Arrays.asList(savedCard, newCard);
                    cardRepository.saveAll(cards);
                    return;
                }
                updateMapper.updateCard(updatedCard, savedCard);
                cardRepository.save(savedCard);
            });
        } else {
            cardRepository.findByPersonIdAndSavedIsTrue(person.getId())
                    .ifPresent(card -> {
                        card.setSaved(false);
                        cardRepository.save(card);
                    });
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
        Optional<Person> personOptional = personRepository.findByEmailAndActiveIsTrue(forgotPassRequest.getEmail());
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
        String body = getResourceFileAsString("static/reset_password.html");
        return body.replace("hostUrl", hostUrl + "/reset_password?token=" + uuid);
    }

    public String resetPassword(ResetPassRequest resetPassRequest) {
        Token token = tokenRepository.getToken(resetPassRequest.getToken().toString())
                .orElseThrow(() -> new BadRequestException("Invalid token"));
        Person person = personRepository.findByIdAndActiveIsTrue(token.getPerson().getId())
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
        return token.getId() != null && personRepository.existsByIdAndActiveIsTrue(token.getPerson().getId());
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

    public void deactivate(String password) {
        UUID personId = JwtTokenUtil.getRequestPersonId();
        Person person = personRepository.findById(personId)
                .orElseThrow(() -> new UnauthorizedException("Wrong person id"));
        if (!passwordEncoder.matches(password, person.getPassword()))
            throw new UnauthorizedException("Wrong password");
        List<Product> notPaidProducts = productRepository.getNotPaidProducts(person.getId().toString());
        for (Product product : notPaidProducts)
            product.setNotified(false);
        productRepository.saveAll(notPaidProducts);
        notificationRepository.deleteAllByProductFromUser(personId.toString());
        person.setActive(false);
        personRepository.save(person);
    }
}
