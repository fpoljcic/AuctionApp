package ba.atlantbh.auctionapp.controllers;

import ba.atlantbh.auctionapp.exceptions.UnauthorizedException;
import ba.atlantbh.auctionapp.responses.CardResponse;
import ba.atlantbh.auctionapp.responses.EmptyResponse;
import ba.atlantbh.auctionapp.services.CardService;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@AllArgsConstructor
@RestController
@RequestMapping("/cards")
public class CardController {

    private final CardService cardService;

    @GetMapping("/person")
    @ApiResponses(value = {
            @ApiResponse(code = 401, message = "Unauthorized", response = UnauthorizedException.class),
    })
    public ResponseEntity<Object> getCard() {
        CardResponse card = cardService.getCard();
        if (card.getName() == null)
            return ResponseEntity.ok(new EmptyResponse());
        else
            return ResponseEntity.ok(card);
    }
}
