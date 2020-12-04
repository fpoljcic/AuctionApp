package ba.atlantbh.auctionapp.controllers;

import ba.atlantbh.auctionapp.exceptions.BadRequestException;
import ba.atlantbh.auctionapp.exceptions.UnauthorizedException;
import ba.atlantbh.auctionapp.exceptions.UnprocessableException;
import ba.atlantbh.auctionapp.models.enums.Color;
import ba.atlantbh.auctionapp.models.enums.Size;
import ba.atlantbh.auctionapp.projections.UserProductProj;
import ba.atlantbh.auctionapp.projections.SimpleProductProj;
import ba.atlantbh.auctionapp.requests.*;
import ba.atlantbh.auctionapp.responses.*;
import ba.atlantbh.auctionapp.services.ProductService;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService productService;

    @GetMapping("/featured")
    public ResponseEntity<List<SimpleProductProj>> getFeaturedProducts() {
        return ResponseEntity.ok(productService.getFeaturedProducts());
    }

    @GetMapping("/new")
    public ResponseEntity<List<SimpleProductProj>> getNewProducts() {
        return ResponseEntity.ok(productService.getNewProducts());
    }

    @GetMapping("/last")
    public ResponseEntity<List<SimpleProductProj>> getLastProducts() {
        return ResponseEntity.ok(productService.getLastProducts());
    }

    @GetMapping
    @ApiResponses(value = {
            @ApiResponse(code = 400, message = "Bad request", response = BadRequestException.class),
            @ApiResponse(code = 422, message = "Unprocessable entity", response = UnprocessableException.class),
    })
    public ResponseEntity<ProductResponse> getProduct(@RequestParam String productId,
                                                      @RequestParam(defaultValue = "") String userId) {
        return ResponseEntity.ok(productService.getProduct(productId, userId));
    }

    @GetMapping("/related")
    @ApiResponses(value = {
            @ApiResponse(code = 400, message = "Bad request", response = BadRequestException.class),
            @ApiResponse(code = 422, message = "Unprocessable entity", response = UnprocessableException.class),
    })
    public ResponseEntity<List<SimpleProductProj>> getRelatedProducts(@RequestParam String id) {
        return ResponseEntity.ok(productService.getRelatedProducts(id));
    }

    @GetMapping("/search")
    @ApiResponses(value = {
            @ApiResponse(code = 400, message = "Bad request", response = BadRequestException.class),
    })
    public ResponseEntity<ProductPageResponse> search(@Valid SearchRequest searchRequest) {
        return ResponseEntity.ok(productService.search(
                searchRequest.getQuery().trim(),
                searchRequest.getCategory(),
                searchRequest.getSubcategory(),
                searchRequest.getPage(),
                searchRequest.getSort(),
                searchRequest.getMinPrice(),
                searchRequest.getMaxPrice(),
                searchRequest.getColor(),
                searchRequest.getSize()
        ));
    }

    @GetMapping("/search/count")
    @ApiResponses(value = {
            @ApiResponse(code = 400, message = "Bad request", response = BadRequestException.class),
    })
    public ResponseEntity<List<CategoryCountReponse>> searchCount(@Valid SearchCountRequest searchCountRequest) {
        return ResponseEntity.ok(productService.searchCount(
                searchCountRequest.getQuery().trim(),
                searchCountRequest.getMinPrice(),
                searchCountRequest.getMaxPrice(),
                searchCountRequest.getColor(),
                searchCountRequest.getSize()
        ));
    }

    @GetMapping("/filter/count")
    @ApiResponses(value = {
            @ApiResponse(code = 400, message = "Bad request", response = BadRequestException.class),
    })
    public ResponseEntity<FilterCountResponse> filterCount(@Valid FilterCountRequest filterCountRequest) {
        return ResponseEntity.ok(productService.filterCount(
                filterCountRequest.getQuery().trim(),
                filterCountRequest.getCategory(),
                filterCountRequest.getSubcategory(),
                filterCountRequest.getMinPrice(),
                filterCountRequest.getMaxPrice(),
                filterCountRequest.getColor(),
                filterCountRequest.getSize()
        ));
    }

    @GetMapping("/filters")
    public ResponseEntity<FilterResponse> getFilters() {
        return ResponseEntity.ok(new FilterResponse(Color.values(), Size.values()));
    }

    @PostMapping("/add")
    @ApiResponses(value = {
            @ApiResponse(code = 400, message = "Bad request", response = BadRequestException.class),
            @ApiResponse(code = 401, message = "Unauthorized", response = UnauthorizedException.class),
            @ApiResponse(code = 422, message = "Unprocessable entity", response = UnprocessableException.class),
    })
    public ResponseEntity<UUID> add(@RequestBody @Valid ProductRequest productRequest) {
        UUID productId = productService.add(productRequest);
        return ResponseEntity.ok(productId);
    }

    @GetMapping("/user")
    @ApiResponses(value = {
            @ApiResponse(code = 401, message = "Unauthorized", response = UnauthorizedException.class),
    })
    public ResponseEntity<List<UserProductProj>> getUserProducts() {
        return ResponseEntity.ok(productService.getUserProducts());
    }

    @GetMapping("/user/bid")
    @ApiResponses(value = {
            @ApiResponse(code = 401, message = "Unauthorized", response = UnauthorizedException.class),
    })
    public ResponseEntity<List<UserProductProj>> getUserBidProducts() {
        return ResponseEntity.ok(productService.getUserBidProducts());
    }

    @GetMapping("/user/wishlist")
    @ApiResponses(value = {
            @ApiResponse(code = 401, message = "Unauthorized", response = UnauthorizedException.class),
    })
    public ResponseEntity<List<UserProductProj>> getUserWishlistProducts() {
        return ResponseEntity.ok(productService.getUserWishlistProducts());
    }

    @PostMapping("/pay")
    @ApiResponses(value = {
            @ApiResponse(code = 400, message = "Bad request", response = BadRequestException.class),
            @ApiResponse(code = 401, message = "Unauthorized", response = UnauthorizedException.class),
            @ApiResponse(code = 422, message = "Unprocessable entity", response = UnprocessableException.class),
    })
    public ResponseEntity<String> pay(@RequestBody @Valid PaymentRequest paymentRequest) {
        productService.pay(paymentRequest);
        return ResponseEntity.ok("Product paid");
    }

    @PostMapping("/rate")
    @ApiResponses(value = {
            @ApiResponse(code = 400, message = "Bad request", response = BadRequestException.class),
            @ApiResponse(code = 401, message = "Unauthorized", response = UnauthorizedException.class),
            @ApiResponse(code = 422, message = "Unprocessable entity", response = UnprocessableException.class),
    })
    public ResponseEntity<String> rate(@RequestBody @Valid RateRequest rateRequest) {
        productService.rate(rateRequest.getProductId(), rateRequest.getRating());
        return ResponseEntity.ok("Product rated");
    }
}
