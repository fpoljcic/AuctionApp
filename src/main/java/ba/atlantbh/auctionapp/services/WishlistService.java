package ba.atlantbh.auctionapp.services;

import ba.atlantbh.auctionapp.exceptions.BadRequestException;
import ba.atlantbh.auctionapp.exceptions.UnauthorizedException;
import ba.atlantbh.auctionapp.exceptions.UnprocessableException;
import ba.atlantbh.auctionapp.models.Person;
import ba.atlantbh.auctionapp.models.Product;
import ba.atlantbh.auctionapp.models.Wishlist;
import ba.atlantbh.auctionapp.repositories.PersonRepository;
import ba.atlantbh.auctionapp.repositories.ProductRepository;
import ba.atlantbh.auctionapp.repositories.WishlistRepository;
import ba.atlantbh.auctionapp.requests.WishlistRequest;
import ba.atlantbh.auctionapp.security.JwtTokenUtil;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@AllArgsConstructor
@Service
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final PersonRepository personRepository;
    private final ProductRepository productRepository;

    public void add(WishlistRequest wishlistRequest) {
        UUID personId = JwtTokenUtil.getRequestPersonId();
        Person person = personRepository.findById(personId)
                .orElseThrow(() -> new UnauthorizedException("Wrong person id"));
        Product product = productRepository.findById(wishlistRequest.getProductId())
                .orElseThrow(() -> new UnprocessableException("Wrong product id"));
        if (wishlistRepository.existsByPersonAndProduct(person, product))
            throw new BadRequestException("You already wishlisted this product");
        wishlistRepository.save(new Wishlist(person, product));
    }

    public void remove(WishlistRequest wishlistRequest) {
        UUID personId = JwtTokenUtil.getRequestPersonId();
        Person person = personRepository.findById(personId)
                .orElseThrow(() -> new UnauthorizedException("Wrong person id"));
        Product product = productRepository.findById(wishlistRequest.getProductId())
                .orElseThrow(() -> new UnprocessableException("Wrong product id"));
        Wishlist wishlist = wishlistRepository.findByPersonAndProduct(person, product)
                .orElseThrow(() -> new BadRequestException("You didn't wishlist this product"));
        wishlistRepository.delete(wishlist);
    }
}
