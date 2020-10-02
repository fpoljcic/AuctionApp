package ba.atlantbh.auctionapp.controllers;

import ba.atlantbh.auctionapp.responses.SimpleSubcategoryResponse;
import ba.atlantbh.auctionapp.services.SubcategoryService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/subcategories")
public class SubcategoryController {

    private final SubcategoryService subcategoryService;

    @GetMapping("/random")
    public ResponseEntity<List<SimpleSubcategoryResponse>> getRandomSubcategories() {
        return ResponseEntity.ok(subcategoryService.getRandomSubcategories());
    }
}
