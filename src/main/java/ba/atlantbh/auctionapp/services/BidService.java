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
import ba.atlantbh.auctionapp.projections.SimpleBidProj;
import ba.atlantbh.auctionapp.security.JwtTokenUtil;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@Service
public class BidService {

    private final BidRepository bidRepository;
    private final PersonRepository personRepository;
    private final ProductRepository productRepository;

    public List<SimpleBidProj> getBidsForProduct(String id) {
        if (!productRepository.existsById(UUID.fromString(id)))
            throw new UnprocessableException("Wrong product id");
        return bidRepository.getBidsForProduct(id);
    }

    public void add(BidRequest bidRequest) {
        Product product = productRepository.findById(bidRequest.getProductId())
                .orElseThrow(() -> new UnprocessableException("Wrong product id"));
        if (product.getStartPrice().compareTo(bidRequest.getPrice()) > 0)
            throw new BadRequestException("Price can't be lower than the product start price");
        if (product.getStartDate().isAfter(LocalDateTime.now()))
            throw new BadRequestException("Auction is yet to start for this product");
        if (product.getEndDate().isBefore(LocalDateTime.now()))
            throw new BadRequestException("Auction ended for this product");
        UUID personId = JwtTokenUtil.getRequestPersonId();
        if (personId == null)
            throw new UnprocessableException("Invalid JWT signature");
        Person person = personRepository.findById(personId)
                .orElseThrow(() -> new UnprocessableException("Wrong person id"));
        if (product.getPerson().getId() == person.getId())
            throw new BadRequestException("You can't bid on your own product");
        BigDecimal maxBid = bidRepository.getMaxBidFromPersonForProduct(person.getId().toString(), product.getId().toString());
        if (maxBid != null && maxBid.compareTo(bidRequest.getPrice()) >= 0)
            throw new BadRequestException("Price can't be lower than your previous bid of $" + maxBid);
        bidRepository.save(new Bid(bidRequest.getPrice(), person, product));
    }
}
