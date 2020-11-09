package ba.atlantbh.auctionapp.responses;

import ba.atlantbh.auctionapp.models.Card;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CardResponse {
    private String name;
    private String cardNumber;
    private Integer expirationYear;
    private Integer expirationMonth;
    private Short cvc;

    public CardResponse(Card card) {
        this.name = card.getName();
        this.cardNumber = card.getMaskedCardNumber();
        this.expirationYear = card.getExpirationYear();
        this.expirationMonth = card.getExpirationMonth();
        this.cvc = card.getCvc();
    }
}
