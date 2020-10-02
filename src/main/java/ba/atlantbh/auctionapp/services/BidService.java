package ba.atlantbh.auctionapp.services;

import ba.atlantbh.auctionapp.exceptions.BadRequestException;
import ba.atlantbh.auctionapp.exceptions.UnprocessableException;
import ba.atlantbh.auctionapp.models.Bid;
import ba.atlantbh.auctionapp.models.Person;
import ba.atlantbh.auctionapp.models.Product;
import ba.atlantbh.auctionapp.repositories.BidRepository;
import ba.atlantbh.auctionapp.repositories.PersonRepository;
import ba.atlantbh.auctionapp.repositories.ProductRepository;
import ba.atlantbh.auctionapp.requests.BidRequest;
import ba.atlantbh.auctionapp.responses.SimpleBidResponse;
import ba.atlantbh.auctionapp.security.JwtTokenUtil;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class BidService {

    private final BidRepository bidRepository;
    private final PersonRepository personRepository;
    private final ProductRepository productRepository;

    public List<SimpleBidResponse> getBidsForProduct(String id) {
        return bidRepository.getBidsForProduct(id);
    }

    public void add(BidRequest bidRequest) {
        Person person = personRepository.findById(JwtTokenUtil.getRequestPersonId()).orElseThrow(() -> new UnprocessableException("Wrong person id"));
        Product product = productRepository.findById(bidRequest.getProductId()).orElseThrow(() -> new UnprocessableException("Wrong product id"));
        if (product.getStartPrice() > bidRequest.getPrice())
            throw new BadRequestException("Price can't be lower than the product start price");
        bidRepository.save(new Bid(bidRequest.getPrice(), person, product));
    }
}
