package ba.atlantbh.auctionapp.controllers;

import ba.atlantbh.auctionapp.responses.SimpleBidResponse;
import ba.atlantbh.auctionapp.services.BidService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/bids")
public class BidController {

    private final BidService bidService;

    public BidController(BidService bidService) {
        this.bidService = bidService;
    }

    @GetMapping("/product/")
    public ResponseEntity<List<SimpleBidResponse>> getBidsForProduct(@RequestParam(name = "id") String id) {
        return ResponseEntity.ok(bidService.getBidsForProduct(id));
    }
}
