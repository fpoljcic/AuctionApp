package ba.atlantbh.auctionapp.services;

import ba.atlantbh.auctionapp.repositories.SubcategoryRepository;
import ba.atlantbh.auctionapp.projections.SimpleSubcategoryProj;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class SubcategoryService {

    private final SubcategoryRepository subcategoryRepository;

    public List<SimpleSubcategoryProj> getRandomSubcategories() {
        return subcategoryRepository.getRandomSubcategories();
    }
}
