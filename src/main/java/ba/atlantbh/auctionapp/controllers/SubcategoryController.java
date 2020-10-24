package ba.atlantbh.auctionapp.controllers;

import ba.atlantbh.auctionapp.projections.SimpleSubcategoryProj;
import ba.atlantbh.auctionapp.projections.SubcategoryProj;
import ba.atlantbh.auctionapp.services.SubcategoryService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/subcategories")
public class SubcategoryController {

    private final SubcategoryService subcategoryService;

    @GetMapping("/random")
    public ResponseEntity<List<SubcategoryProj>> getRandomSubcategories() {
        return ResponseEntity.ok(subcategoryService.getRandomSubcategories());
    }

    @GetMapping("/category")
    public ResponseEntity<List<SimpleSubcategoryProj>> getSubcategoriesForCategory(@RequestParam String id) {
        return ResponseEntity.ok(subcategoryService.getSubcategoriesForCategory(id));
    }
}
