package ba.atlantbh.auctionapp.controllers;

import ba.atlantbh.auctionapp.projections.CategoryProj;
import ba.atlantbh.auctionapp.services.CategoryService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/categories")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<CategoryProj>> getCategories() {
        return ResponseEntity.ok(categoryService.getCategories());
    }
}
