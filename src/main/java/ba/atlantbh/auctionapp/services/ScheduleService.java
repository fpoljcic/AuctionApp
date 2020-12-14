package ba.atlantbh.auctionapp.services;

import ba.atlantbh.auctionapp.exceptions.BadGatewayException;
import ba.atlantbh.auctionapp.exceptions.UnprocessableException;
import ba.atlantbh.auctionapp.models.Notification;
import ba.atlantbh.auctionapp.models.Person;
import ba.atlantbh.auctionapp.models.Product;
import ba.atlantbh.auctionapp.projections.WinnerProj;
import ba.atlantbh.auctionapp.repositories.ProductRepository;
import ba.atlantbh.auctionapp.utilities.StringUtil;
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
    private final PushService pushService;
    private final EmailService emailService;

    private String hostUrl;

    @Value("${app.hostUrl}")
    public void setHostUrl(String hostUrl) {
        this.hostUrl = hostUrl;
    }

    @Scheduled(fixedRateString = "${app.scheduleRate}")
    public void notifyHighestBidders() {
        List<WinnerProj> winners = productRepository.getNotNotifiedWinners();
        for (WinnerProj winner : winners) {
            if (winner.getPushNotify()) {
                Notification notification = new Notification(
                        "success",
                        "Congratulations! You outbid the competition, your bid of $" + winner.getMaxBid() +
                                " is the highest bid.",
                        new Product(winner.getProductId(), winner.getProductName()),
                        new Person(winner.getId())
                );
                pushService.broadcastNotification(notification, winner.getId().toString());
            }
            if (winner.getEmailNotify()) {
                String body = formEmailBody(hostUrl, winner);
                try {
                    emailService.sendMail(winner.getEmail(), "Bid winner", body);
                } catch (MessagingException e) {
                    throw new BadGatewayException("We have issues sending an email");
                }
            }
            Product product = productRepository.findById(winner.getProductId())
                    .orElseThrow(() -> new UnprocessableException("Wrong product id"));
            product.setNotified(true);
            productRepository.save(product);
        }
    }

    private String formEmailBody(String hostUrl, WinnerProj winner) {
        String body = getResourceFileAsString("static/win_bid.html");
        return body.replace("maxBid", winner.getMaxBid().toPlainString())
                .replace("productName", winner.getProductName())
                .replace("productId", winner.getProductId().toString())
                .replace("paymentUrl", StringUtil.getPaymentPageUrl(winner.getProductId().toString(), hostUrl))
                .replace("settingsUrl", hostUrl + "/my_account/settings");
    }

}
