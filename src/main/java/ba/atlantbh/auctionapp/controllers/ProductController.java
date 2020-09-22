package ba.atlantbh.auctionapp.controllers;

import ba.atlantbh.auctionapp.models.Product;
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
        List<EssentialProductInfoResponse> products = productService.getFeaturedRandomProducts();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/new")
    public ResponseEntity<List<EssentialProductInfoResponse>> getNewProducts() {
        List<EssentialProductInfoResponse> products = productService.getNewProducts();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/last")
    public ResponseEntity<List<EssentialProductInfoResponse>> getLastProducts() {
        List<EssentialProductInfoResponse> products = productService.getLastProducts();
        return ResponseEntity.ok(products);
    }
}
