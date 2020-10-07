package ba.atlantbh.auctionapp.controllers;

import ba.atlantbh.auctionapp.requests.WishlistRequest;
import ba.atlantbh.auctionapp.services.WishlistService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@AllArgsConstructor
@RestController
@RequestMapping("/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    @PostMapping("/add")
    public ResponseEntity<String> add(@RequestBody @Valid WishlistRequest wishlistRequest) {
        wishlistService.add(wishlistRequest);
        return ResponseEntity.ok("Product added to wishlist");
    }

    @PostMapping("/remove")
    public ResponseEntity<String> remove(@RequestBody @Valid WishlistRequest wishlistRequest) {
        wishlistService.remove(wishlistRequest);
        return ResponseEntity.ok("Product removed from wishlist");
    }
}
