package ba.atlantbh.auctionapp.repositories;

import ba.atlantbh.auctionapp.models.PayPal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PayPalRepository extends JpaRepository<PayPal, UUID> {
}
