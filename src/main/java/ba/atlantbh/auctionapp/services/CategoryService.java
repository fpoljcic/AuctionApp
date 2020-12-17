package ba.atlantbh.auctionapp.services;

import ba.atlantbh.auctionapp.repositories.CategoryRepository;
import ba.atlantbh.auctionapp.projections.CategoryProj;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryProj> getCategories() {
        return categoryRepository.getAll();
    }
}
