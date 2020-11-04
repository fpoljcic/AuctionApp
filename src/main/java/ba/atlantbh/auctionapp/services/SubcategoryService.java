package ba.atlantbh.auctionapp.services;

import ba.atlantbh.auctionapp.exceptions.UnprocessableException;
import ba.atlantbh.auctionapp.models.Category;
import ba.atlantbh.auctionapp.projections.SimpleSubcategoryProj;
import ba.atlantbh.auctionapp.projections.SubcategoryProj;
import ba.atlantbh.auctionapp.repositories.CategoryRepository;
import ba.atlantbh.auctionapp.repositories.SubcategoryRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@Service
public class SubcategoryService {

    private final SubcategoryRepository subcategoryRepository;
    private final CategoryRepository categoryRepository;

    public List<SubcategoryProj> getRandomSubcategories() {
        return subcategoryRepository.getRandomSubcategories();
    }

    public List<SimpleSubcategoryProj> getSubcategoriesForCategory(String id) {
        Category category = categoryRepository.findById(UUID.fromString(id))
                .orElseThrow(() -> new UnprocessableException("Wrong category id"));

        return subcategoryRepository.findAllByCategory(category);
    }
}
