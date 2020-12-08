package ba.atlantbh.auctionapp.services;

import ba.atlantbh.auctionapp.exceptions.BadRequestException;
import ba.atlantbh.auctionapp.exceptions.UnauthorizedException;
import ba.atlantbh.auctionapp.exceptions.UnprocessableException;
import ba.atlantbh.auctionapp.models.Bid;
import ba.atlantbh.auctionapp.models.Person;
import ba.atlantbh.auctionapp.models.Product;
import ba.atlantbh.auctionapp.projections.SimpleBidProj;
import ba.atlantbh.auctionapp.repositories.BidRepository;
import ba.atlantbh.auctionapp.repositories.PersonRepository;
import ba.atlantbh.auctionapp.repositories.ProductRepository;
import ba.atlantbh.auctionapp.requests.BidRequest;
import ba.atlantbh.auctionapp.security.JwtTokenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static ba.atlantbh.auctionapp.utilities.ResourceUtil.getResourceFileAsString;

@RequiredArgsConstructor
@Service
public class BidService {

    private final BidRepository bidRepository;
    private final PersonRepository personRepository;
    private final ProductRepository productRepository;
    private final EmailService emailService;

    private String hostUrl;

    @Value("${app.hostUrl}")
    public void setHostUrl(String hostUrl) {
        this.hostUrl = hostUrl;
    }

    public List<SimpleBidProj> getBidsForProduct(String id) {
        if (!productRepository.existsByIdAndIsActive(id))
            throw new UnprocessableException("Wrong product id");
        return bidRepository.getBidsForProduct(id);
    }

    public void add(BidRequest bidRequest) {
        Product product = productRepository.findByIdAndIsActive(bidRequest.getProductId().toString())
                .orElseThrow(() -> new UnprocessableException("Wrong product id"));
        if (product.getStartPrice().compareTo(bidRequest.getPrice()) > 0)
            throw new BadRequestException("Price can't be lower than the product start price");
        if (product.getStartDate().isAfter(LocalDateTime.now()))
            throw new BadRequestException("Auction is yet to start for this product");
        if (product.getEndDate().isBefore(LocalDateTime.now()))
            throw new BadRequestException("Auction ended for this product");
        UUID personId = JwtTokenUtil.getRequestPersonId();
        Person person = personRepository.findById(personId)
                .orElseThrow(() -> new UnauthorizedException("Wrong person id"));
        if (product.getPerson().getId() == person.getId())
            throw new BadRequestException("You can't bid on your own product");
        BigDecimal maxBid = bidRepository.getMaxBidFromPersonForProduct(person.getId().toString(), product.getId().toString());
        if (maxBid != null && maxBid.compareTo(bidRequest.getPrice()) >= 0)
            throw new BadRequestException("Price can't be lower than your previous bid of $" + maxBid);
        notifyHighestBidder(product, person.getEmail(), bidRequest.getPrice());
        bidRepository.save(new Bid(bidRequest.getPrice(), person, product));
    }

    private void notifyHighestBidder(Product product, String email, BigDecimal price) {
        bidRepository.getHighestBidder(product.getId().toString())
                .ifPresent(bidder -> new Thread(() -> {
                    try {
                        if (bidder.getEmailNotify() && !email.equals(bidder.getEmail())
                                && bidder.getMaxBid().compareTo(price) < 0) {
                            String body = formEmailBody(hostUrl, product, bidder.getMaxBid().toPlainString());
                            emailService.sendMail(bidder.getEmail(), "Lost highest bid place", body);
                        }
                    } catch (MessagingException ignore) {
                    }
                }).start());
    }

    private String formEmailBody(String hostUrl, Product product, String maxBid) {
        String body = getResourceFileAsString("static/higher_bid.html");
        return body.replace("maxBid", maxBid)
                .replace("productName", product.getName())
                .replace("productId", product.getId().toString())
                .replace("productPageUrl", hostUrl + "/shop/" +
                        removeSpaces(product.getSubcategory().getCategory().getName()) + "/" +
                        removeSpaces(product.getSubcategory().getName())
                        + "/" + product.getId())
                .replace("settingsUrl", hostUrl + "/my_account/settings");
    }

    private String removeSpaces(String name) {
        return name.replaceAll(" ", "_").toLowerCase();
    }
}
