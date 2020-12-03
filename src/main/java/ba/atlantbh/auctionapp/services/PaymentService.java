package ba.atlantbh.auctionapp.services;

import ba.atlantbh.auctionapp.exceptions.BadRequestException;
import ba.atlantbh.auctionapp.projections.ReceiptProj;
import ba.atlantbh.auctionapp.repositories.PaymentRepository;
import ba.atlantbh.auctionapp.security.JwtTokenUtil;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.concurrent.atomic.AtomicReference;

@AllArgsConstructor
@Service
public class PaymentService {
    private final PaymentRepository paymentRepository;

    public ReceiptProj getReceipt(String productId) {
        AtomicReference<UUID> personId = new AtomicReference<>(JwtTokenUtil.getRequestPersonId());

        paymentRepository.getBidderIdFromReceipt(personId.toString(), productId)
                .ifPresent(personId::set);

        return paymentRepository.getReceipt(personId.toString(), productId)
                .orElseThrow(() -> new BadRequestException("You don't have a receipt for this product"));
    }
}
