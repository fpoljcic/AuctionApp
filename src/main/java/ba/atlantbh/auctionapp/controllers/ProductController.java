package ba.atlantbh.auctionapp.controllers;

import ba.atlantbh.auctionapp.projections.SimpleProductProj;
import ba.atlantbh.auctionapp.requests.FilterCountRequest;
import ba.atlantbh.auctionapp.requests.SearchCountRequest;
import ba.atlantbh.auctionapp.requests.SearchRequest;
import ba.atlantbh.auctionapp.responses.CategoryCountReponse;
import ba.atlantbh.auctionapp.responses.FilterCountResponse;
import ba.atlantbh.auctionapp.responses.ProductPageResponse;
import ba.atlantbh.auctionapp.responses.ProductResponse;
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
}
