package ba.atlantbh.auctionapp.services;

import ba.atlantbh.auctionapp.exceptions.BadRequestException;
import ba.atlantbh.auctionapp.projections.ReceiptProj;
import ba.atlantbh.auctionapp.repositories.PaymentRepository;
import ba.atlantbh.auctionapp.security.JwtTokenUtil;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@AllArgsConstructor
@Service
public class PaymentService {
    private final PaymentRepository paymentRepository;

    public ReceiptProj getReceipt(String productId) {
        UUID personId = JwtTokenUtil.getRequestPersonId();

        return paymentRepository.getReceipt(personId.toString(), productId)
                .orElseThrow(() -> new BadRequestException("You don't have a receipt for this product"));
    }
}
