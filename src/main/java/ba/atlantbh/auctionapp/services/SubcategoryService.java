package ba.atlantbh.auctionapp.services;

import ba.atlantbh.auctionapp.repositories.SubcategoryRepository;
import ba.atlantbh.auctionapp.responses.SimpleSubcategoryResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubcategoryService {

    private final SubcategoryRepository subcategoryRepository;

    public SubcategoryService(SubcategoryRepository subcategoryRepository) {
        this.subcategoryRepository = subcategoryRepository;
    }

    public List<SimpleSubcategoryResponse> getRandomSubcategories() {
        return subcategoryRepository.getRandomSubcategories();
    }
}