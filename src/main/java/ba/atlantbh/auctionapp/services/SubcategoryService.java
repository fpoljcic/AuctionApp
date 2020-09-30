package ba.atlantbh.auctionapp.services;

import ba.atlantbh.auctionapp.repositories.SubcategoryRepository;
import ba.atlantbh.auctionapp.responses.SimpleSubcategoryResponse;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class SubcategoryService {

    private final SubcategoryRepository subcategoryRepository;

    public List<SimpleSubcategoryResponse> getRandomSubcategories() {
        return subcategoryRepository.getRandomSubcategories();
    }
}
