package ba.atlantbh.auctionapp.services;

import ba.atlantbh.auctionapp.exceptions.NotFoundException;
import ba.atlantbh.auctionapp.repositories.BidRepository;
import ba.atlantbh.auctionapp.responses.SimpleBidResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BidService {

    private final BidRepository bidRepository;

    public BidService(BidRepository bidRepository) {
        this.bidRepository = bidRepository;
    }

    public List<SimpleBidResponse> getBidsForProduct(String id) {
        List<SimpleBidResponse> bids = bidRepository.getBidsForProduct(id);
        if (bids.isEmpty())
            throw new NotFoundException("Wrong product id");
        return bids;
    }
}
