package ba.atlantbh.auctionapp.controllers;

import ba.atlantbh.auctionapp.requests.SearchRequest;
import ba.atlantbh.auctionapp.responses.*;
import ba.atlantbh.auctionapp.services.ProductService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService productService;

    @GetMapping("/featured/random")
    public ResponseEntity<List<SimpleProductResponse>> getFeaturedRandomProducts() {
        return ResponseEntity.ok(productService.getFeaturedRandomProducts());
    }

    @GetMapping("/new")
    public ResponseEntity<List<SimpleProductResponse>> getNewProducts() {
        return ResponseEntity.ok(productService.getNewProducts());
    }

    @GetMapping("/last")
    public ResponseEntity<List<SimpleProductResponse>> getLastProducts() {
        return ResponseEntity.ok(productService.getLastProducts());
    }

    @GetMapping
    public ResponseEntity<ProductResponse> getProduct(@RequestParam(name = "product_id") String productId,
                                                      @RequestParam(name = "user_id", defaultValue = "") String userId) {
        return ResponseEntity.ok(productService.getProduct(productId, userId));
    }

    @GetMapping("/related")
    public ResponseEntity<List<SimpleProductResponse>> getRelatedProducts(@RequestParam(name = "id") String id) {
        return ResponseEntity.ok(productService.getRelatedProducts(id));
    }

    @GetMapping("/search")
    public ResponseEntity<ProductPageResponse> search(@Valid SearchRequest searchRequest) {
        return ResponseEntity.ok(productService.search(
                searchRequest.getQuery(),
                searchRequest.getCategory(),
                searchRequest.getSubcategory(),
                searchRequest.getPage(),
                searchRequest.getSort()
        ));
    }

    @GetMapping("/search/count")
    public ResponseEntity<List<CategoryCountReponse>> searchCount(@RequestParam(name = "query", defaultValue = "") String query) {
        return ResponseEntity.ok(productService.searchCount(query));
    }
}
