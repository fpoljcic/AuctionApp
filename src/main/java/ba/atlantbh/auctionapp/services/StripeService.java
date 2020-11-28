package ba.atlantbh.auctionapp.services;

import ba.atlantbh.auctionapp.models.Person;
import ba.atlantbh.auctionapp.repositories.PersonRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Card;
import com.stripe.model.Charge;
import com.stripe.model.Customer;
import com.stripe.model.Token;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@Service
public class StripeService {
    private String stripeApiKey;
    private final PersonRepository personRepository;

    @Value("${app.stripeApiKey}")
    public void setStripeApiKey(String stripeApiKey) {
        this.stripeApiKey = stripeApiKey;
    }

    public String pay(Integer amount, String stripeCustomerId, String stripeCardId, String description) throws StripeException {
        Stripe.apiKey = stripeApiKey;

        Map<String, Object> params = new HashMap<>();
        params.put("amount", amount);
        params.put("currency", "usd");
        params.put("customer", stripeCustomerId);
        params.put("source", stripeCardId);
        params.put("description", description);

        Charge charge = Charge.create(params);
        return charge.getId();
    }

    public String saveCustomer(Person person) throws StripeException {
        Stripe.apiKey = stripeApiKey;

        Map<String, Object> params = new HashMap<>();
        params.put("name", person.getFirstName() + " " + person.getLastName());
        params.put("email", person.getEmail());
        params.put("description", person.getId());

        Customer customer = Customer.create(params);
        return customer.getId();
    }

    public String updateCustomer(Person person) throws StripeException {
        Stripe.apiKey = stripeApiKey;

        Customer customer = Customer.retrieve(person.getStripeCustomerId());

        Map<String, Object> params = new HashMap<>();
        params.put("email", person.getEmail());

        Customer updatedCustomer = customer.update(params);

        return updatedCustomer.getId();
    }

    public String updateCard(ba.atlantbh.auctionapp.models.Card newCard, Person person) throws StripeException {
        Stripe.apiKey = stripeApiKey;

        Map<String, Object> retrieveParams = new HashMap<>();
        List<String> expandList = new ArrayList<>();
        expandList.add("sources");
        retrieveParams.put("expand", expandList);
        Customer customer = Customer.retrieve(person.getStripeCustomerId(), retrieveParams, null);

        Card card = (Card) customer.getSources().retrieve(newCard.getStripeCardId());

        Map<String, Object> params = new HashMap<>();
        params.put("exp_month", newCard.getExpirationMonth());
        params.put("exp_year", newCard.getExpirationYear());
        params.put("name", newCard.getName());

        Card updatedCard = card.update(params);
        return updatedCard.getId();
    }

    public String saveCard(ba.atlantbh.auctionapp.models.Card newCard, Person person, Boolean newDefault) throws StripeException {
        Stripe.apiKey = stripeApiKey;

        String stripeCustomerId = person.getStripeCustomerId();

        if (stripeCustomerId == null) {
            stripeCustomerId = saveCustomer(person);
            person.setStripeCustomerId(stripeCustomerId);
            personRepository.save(person);
        }

        Map<String, Object> retrieveParams = new HashMap<>();
        List<String> expandList = new ArrayList<>();
        expandList.add("sources");
        retrieveParams.put("expand", expandList);
        Customer customer = Customer.retrieve(stripeCustomerId, retrieveParams, null);

        Map<String, Object> params = new HashMap<>();
        Token token = generateCardToken(newCard, person);
        params.put("source", token.getId());

        Card card = (Card) customer.getSources().create(params);
        String cardId = card.getId();

        if (newDefault) {
            Map<String, Object> customerParams = new HashMap<>();
            customerParams.put("default_source", cardId);
            customer.update(customerParams);
        }

        return cardId;
    }

    private Token generateCardToken(ba.atlantbh.auctionapp.models.Card newCard, Person person) throws StripeException {
        Map<String, Object> params = new HashMap<>();

        Map<String, Object> card = new HashMap<>();
        card.put("number", newCard.getCardNumber());
        card.put("exp_month", newCard.getExpirationMonth());
        card.put("exp_year", newCard.getExpirationYear());
        card.put("cvc", newCard.getCvc());
        card.put("name", newCard.getName());
        params.put("card", card);

        return Token.create(params);
    }
}
