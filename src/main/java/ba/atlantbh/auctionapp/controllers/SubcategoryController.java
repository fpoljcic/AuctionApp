package ba.atlantbh.auctionapp.controllers;

import ba.atlantbh.auctionapp.exceptions.BadRequestException;
import ba.atlantbh.auctionapp.exceptions.UnprocessableException;
import ba.atlantbh.auctionapp.projections.SimpleSubcategoryProj;
import ba.atlantbh.auctionapp.projections.SubcategoryProj;
import ba.atlantbh.auctionapp.services.SubcategoryService;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
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

    @GetMapping("/featured")
    public ResponseEntity<List<SubcategoryProj>> getFeaturedSubcategories() {
        return ResponseEntity.ok(subcategoryService.getFeaturedSubcategories());
    }

    @GetMapping("/category")
    @ApiResponses(value = {
            @ApiResponse(code = 400, message = "Bad request", response = BadRequestException.class),
            @ApiResponse(code = 422, message = "Unprocessable entity", response = UnprocessableException.class),
    })
    public ResponseEntity<List<SimpleSubcategoryProj>> getSubcategoriesForCategory(@RequestParam String id) {
        return ResponseEntity.ok(subcategoryService.getSubcategoriesForCategory(id));
    }
}
