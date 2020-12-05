package ba.atlantbh.auctionapp.services;

import ba.atlantbh.auctionapp.exceptions.BadGatewayException;
import ba.atlantbh.auctionapp.exceptions.UnprocessableException;
import ba.atlantbh.auctionapp.models.Product;
import ba.atlantbh.auctionapp.projections.WinnerProj;
import ba.atlantbh.auctionapp.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import java.util.List;

import static ba.atlantbh.auctionapp.utilities.ResourceUtil.getResourceFileAsString;

@Service
@EnableScheduling
@RequiredArgsConstructor
public class ScheduleService {

    private final ProductRepository productRepository;
    private final EmailService emailService;

    private String hostUrl;

    @Value("${app.hostUrl}")
    public void setHostUrl(String hostUrl) {
        this.hostUrl = hostUrl;
    }

    @Scheduled(fixedRate = 3600000)
    public void notifyHighestBidders() {
        List<WinnerProj> winners = productRepository.getNotNotifiedWinners();
        for (WinnerProj winner : winners) {
            try {
                String body = formEmailBody(hostUrl, winner);
                if (winner.getEmailNotify())
                    emailService.sendMail(winner.getEmail(), "Bid winner", body);
                Product product = productRepository.findById(winner.getProductId())
                        .orElseThrow(() -> new UnprocessableException("Wrong product id"));
                product.setNotified(true);
                productRepository.save(product);
            } catch (MessagingException e) {
                throw new BadGatewayException("We have issues sending an email");
            }
        }
    }

    private String formEmailBody(String hostUrl, WinnerProj winner) {
        String body = getResourceFileAsString("static/win_bid.html");
        return body.replace("maxBid", winner.getMaxBid().toPlainString())
                .replace("productName", winner.getProductName())
                .replace("productId", winner.getProductId().toString())
                .replace("paymentUrl", hostUrl + "/my_account/bids")
                .replace("settingsUrl", hostUrl + "/my_account/settings");
    }

}
