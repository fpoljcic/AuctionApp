package ba.atlantbh.auctionapp.controllers;

import ba.atlantbh.auctionapp.models.enums.Color;
import ba.atlantbh.auctionapp.models.enums.Size;
import ba.atlantbh.auctionapp.projections.SimpleProductProj;
import ba.atlantbh.auctionapp.requests.FilterCountRequest;
import ba.atlantbh.auctionapp.requests.ProductRequest;
import ba.atlantbh.auctionapp.requests.SearchCountRequest;
import ba.atlantbh.auctionapp.requests.SearchRequest;
import ba.atlantbh.auctionapp.responses.*;
import ba.atlantbh.auctionapp.services.ProductService;
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

    @GetMapping("/featured/random")
    public ResponseEntity<List<SimpleProductProj>> getFeaturedRandomProducts() {
        return ResponseEntity.ok(productService.getFeaturedRandomProducts());
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
    public ResponseEntity<ProductResponse> getProduct(@RequestParam String productId,
                                                      @RequestParam(defaultValue = "") String userId) {
        return ResponseEntity.ok(productService.getProduct(productId, userId));
    }

    @GetMapping("/related")
    public ResponseEntity<List<SimpleProductProj>> getRelatedProducts(@RequestParam String id) {
        return ResponseEntity.ok(productService.getRelatedProducts(id));
    }

    @GetMapping("/search")
    public ResponseEntity<ProductPageResponse> search(@Valid SearchRequest searchRequest) {
        return ResponseEntity.ok(productService.search(
                searchRequest.getQuery(),
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
    public ResponseEntity<List<CategoryCountReponse>> searchCount(@Valid SearchCountRequest searchCountRequest) {
        return ResponseEntity.ok(productService.searchCount(
                searchCountRequest.getQuery(),
                searchCountRequest.getMinPrice(),
                searchCountRequest.getMaxPrice(),
                searchCountRequest.getColor(),
                searchCountRequest.getSize()
        ));
    }

    @GetMapping("/filter/count")
    public ResponseEntity<FilterCountResponse> filterCount(@Valid FilterCountRequest filterCountRequest) {
        return ResponseEntity.ok(productService.filterCount(
                filterCountRequest.getQuery(),
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
    public ResponseEntity<UUID> add(@RequestBody @Valid ProductRequest productRequest) {
        UUID productId = productService.add(productRequest);
        return ResponseEntity.ok(productId);
    }
}
