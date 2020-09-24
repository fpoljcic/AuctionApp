package ba.atlantbh.auctionapp.controllers;

import ba.atlantbh.auctionapp.responses.EssentialSubcategoryInfoResponse;
import ba.atlantbh.auctionapp.services.SubcategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/subcategories")
public class SubcategoryController {

    private final SubcategoryService subcategoryService;

    public SubcategoryController(SubcategoryService subcategoryService) {
        this.subcategoryService = subcategoryService;
    }

    @GetMapping("/random")
    public ResponseEntity<List<EssentialSubcategoryInfoResponse>> getRandomSubcategories() {
        return ResponseEntity.ok(subcategoryService.getRandomSubcategories());
    }
}
