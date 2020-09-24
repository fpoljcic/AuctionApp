package ba.atlantbh.auctionapp.controllers;

import ba.atlantbh.auctionapp.responses.EssentialProductInfoResponse;
import ba.atlantbh.auctionapp.services.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/featured/random")
    public ResponseEntity<List<EssentialProductInfoResponse>> getFeaturedRandomProducts() {
        return ResponseEntity.ok(productService.getFeaturedRandomProducts());
    }

    @GetMapping("/new")
    public ResponseEntity<List<EssentialProductInfoResponse>> getNewProducts() {
        return ResponseEntity.ok(productService.getNewProducts());
    }

    @GetMapping("/last")
    public ResponseEntity<List<EssentialProductInfoResponse>> getLastProducts() {
        return ResponseEntity.ok(productService.getLastProducts());
    }
}
