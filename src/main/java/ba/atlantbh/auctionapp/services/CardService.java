package ba.atlantbh.auctionapp.services;

import ba.atlantbh.auctionapp.models.Card;
import ba.atlantbh.auctionapp.repositories.CardRepository;
import ba.atlantbh.auctionapp.responses.CardResponse;
import ba.atlantbh.auctionapp.security.JwtTokenUtil;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@AllArgsConstructor
@Service
public class CardService {

    private final CardRepository cardRepository;

    public CardResponse getCard() {
        UUID personId = JwtTokenUtil.getRequestPersonId();
        Card card = cardRepository.findByPersonId(personId).orElse(new Card());
        return new CardResponse(card);
    }
}
