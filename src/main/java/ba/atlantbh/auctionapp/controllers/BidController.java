package ba.atlantbh.auctionapp.controllers;

import ba.atlantbh.auctionapp.exceptions.BadRequestException;
import ba.atlantbh.auctionapp.exceptions.UnauthorizedException;
import ba.atlantbh.auctionapp.exceptions.UnprocessableException;
import ba.atlantbh.auctionapp.requests.BidRequest;
import ba.atlantbh.auctionapp.projections.SimpleBidProj;
import ba.atlantbh.auctionapp.services.BidService;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
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

    @GetMapping("/product")
    @ApiResponses(value = {
            @ApiResponse(code = 400, message = "Bad request", response = BadRequestException.class),
            @ApiResponse(code = 422, message = "Unprocessable entity", response = UnprocessableException.class),
    })
    public ResponseEntity<List<SimpleBidProj>> getBidsForProduct(@RequestParam String id) {
        return ResponseEntity.ok(bidService.getBidsForProduct(id));
    }

    @PostMapping("/add")
    @ApiResponses(value = {
            @ApiResponse(code = 400, message = "Bad request", response = BadRequestException.class),
            @ApiResponse(code = 401, message = "Unauthorized", response = UnauthorizedException.class),
            @ApiResponse(code = 422, message = "Unprocessable entity", response = UnprocessableException.class),
    })
    public ResponseEntity<String> add(@RequestBody @Valid BidRequest bidRequest) {
        bidService.add(bidRequest);
        return ResponseEntity.ok("Bid added");
    }
}
