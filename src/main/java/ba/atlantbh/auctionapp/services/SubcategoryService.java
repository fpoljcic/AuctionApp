package ba.atlantbh.auctionapp.services;

import ba.atlantbh.auctionapp.exceptions.UnauthorizedException;
import ba.atlantbh.auctionapp.exceptions.UnprocessableException;
import ba.atlantbh.auctionapp.models.Category;
import ba.atlantbh.auctionapp.models.Subcategory;
import ba.atlantbh.auctionapp.projections.SimpleSubcategoryProj;
import ba.atlantbh.auctionapp.projections.SubcategoryProj;
import ba.atlantbh.auctionapp.repositories.CategoryRepository;
import ba.atlantbh.auctionapp.repositories.SubcategoryRepository;
import ba.atlantbh.auctionapp.responses.SubcategoriesResponse;
import ba.atlantbh.auctionapp.responses.SubcategoryResponse;
import ba.atlantbh.auctionapp.security.JwtTokenUtil;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@AllArgsConstructor
@Service
public class SubcategoryService {

    private final SubcategoryRepository subcategoryRepository;
    private final CategoryRepository categoryRepository;

    public List<SubcategoryProj> getFeaturedSubcategories() {
        String id = "";
        try {
            id = JwtTokenUtil.getRequestPersonId().toString();
        } catch (UnauthorizedException ignore) {
        }
        return subcategoryRepository.getFeaturedSubcategories(id);
    }

    public List<SimpleSubcategoryProj> getSubcategoriesForCategory(String id) {
        Category category = categoryRepository.findById(UUID.fromString(id))
                .orElseThrow(() -> new UnprocessableException("Wrong category id"));

        return subcategoryRepository.findAllByCategory(category);
    }

    public List<SubcategoriesResponse> getSubcategories() {
        List<SubcategoriesResponse> response = new ArrayList<>();
        List<Subcategory> subcategories = subcategoryRepository.findAll();
        for (Subcategory subcategory : subcategories) {
            int i = response.indexOf(new SubcategoriesResponse(subcategory.getCategory().getName()));
            if (i == -1) {
                response.add(new SubcategoriesResponse(
                        subcategory.getCategory().getId(),
                        subcategory.getCategory().getName(),
                        new ArrayList<>()
                ));
                i = response.size() - 1;
            }
            response.get(i).addSubcategory(new SubcategoryResponse(subcategory.getId(), subcategory.getName()));
        }
        response.sort(Comparator.comparing(SubcategoriesResponse::getName));
        return response;
    }
}
