package ba.atlantbh.auctionapp.services;

import ba.atlantbh.auctionapp.exceptions.BadRequestException;
import ba.atlantbh.auctionapp.exceptions.NotFoundException;
import ba.atlantbh.auctionapp.models.Person;
import ba.atlantbh.auctionapp.models.Product;
import ba.atlantbh.auctionapp.models.Wishlist;
import ba.atlantbh.auctionapp.repositories.PersonRepository;
import ba.atlantbh.auctionapp.repositories.ProductRepository;
import ba.atlantbh.auctionapp.repositories.WishlistRepository;
import ba.atlantbh.auctionapp.requests.WishlistRequest;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final PersonRepository personRepository;
    private final ProductRepository productRepository;

    public void add(WishlistRequest wishlistRequest) {
        Person person = personRepository.findById(wishlistRequest.getPersonId())
                .orElseThrow(() -> new NotFoundException("Wrong person id"));
        Product product = productRepository.findById(wishlistRequest.getProductId())
                .orElseThrow(() -> new NotFoundException("Wrong product id"));
        wishlistRepository.save(new Wishlist(person, product));
    }

    public void remove(WishlistRequest wishlistRequest) {
        Person person = personRepository.findById(wishlistRequest.getPersonId())
                .orElseThrow(() -> new NotFoundException("Wrong person id"));
        Product product = productRepository.findById(wishlistRequest.getProductId())
                .orElseThrow(() -> new NotFoundException("Wrong product id"));
        Wishlist wishlist = wishlistRepository.findByPersonAndProduct(person, product);
        if (wishlist == null)
            throw new BadRequestException("You didn't wishlist this product");
        wishlistRepository.delete(wishlist);
    }
}
