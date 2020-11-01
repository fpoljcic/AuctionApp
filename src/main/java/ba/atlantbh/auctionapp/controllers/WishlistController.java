package ba.atlantbh.auctionapp.controllers;

import ba.atlantbh.auctionapp.exceptions.BadRequestException;
import ba.atlantbh.auctionapp.exceptions.UnauthorizedException;
import ba.atlantbh.auctionapp.exceptions.UnprocessableException;
import ba.atlantbh.auctionapp.requests.WishlistRequest;
import ba.atlantbh.auctionapp.services.WishlistService;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@AllArgsConstructor
@RestController
@RequestMapping("/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    @PostMapping("/add")
    @ApiResponses(value = {
            @ApiResponse(code = 400, message = "Bad request", response = BadRequestException.class),
            @ApiResponse(code = 401, message = "Unauthorized", response = UnauthorizedException.class),
            @ApiResponse(code = 422, message = "Unprocessable entity", response = UnprocessableException.class),
    })
    public ResponseEntity<String> add(@RequestBody @Valid WishlistRequest wishlistRequest) {
        wishlistService.add(wishlistRequest);
        return ResponseEntity.ok("Product added to wishlist");
    }

    @PostMapping("/remove")
    @ApiResponses(value = {
            @ApiResponse(code = 400, message = "Bad request", response = BadRequestException.class),
            @ApiResponse(code = 401, message = "Unauthorized", response = UnauthorizedException.class),
            @ApiResponse(code = 422, message = "Unprocessable entity", response = UnprocessableException.class),
    })
    public ResponseEntity<String> remove(@RequestBody @Valid WishlistRequest wishlistRequest) {
        wishlistService.remove(wishlistRequest);
        return ResponseEntity.ok("Product removed from wishlist");
    }
}
