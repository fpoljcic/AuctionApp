package ba.atlantbh.auctionapp.services;

import ba.atlantbh.auctionapp.models.Category;
import ba.atlantbh.auctionapp.repositories.CategoryRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<Category> getCategories() {
        return categoryRepository.findAll();
    }
}
