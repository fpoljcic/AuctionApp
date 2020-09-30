package ba.atlantbh.auctionapp.controllers;

import ba.atlantbh.auctionapp.requests.BidRequest;
import ba.atlantbh.auctionapp.responses.SimpleBidResponse;
import ba.atlantbh.auctionapp.services.BidService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/bids")
public class BidController {

    private final BidService bidService;

    @GetMapping("/product/")
    public ResponseEntity<List<SimpleBidResponse>> getBidsForProduct(@RequestParam(name = "id") String id) {
        return ResponseEntity.ok(bidService.getBidsForProduct(id));
    }

    @PostMapping("/add")
    public ResponseEntity<String> add(@RequestBody @Valid BidRequest bidRequest) {
        bidService.add(bidRequest);
        return ResponseEntity.ok("Bid added");
    }
}
