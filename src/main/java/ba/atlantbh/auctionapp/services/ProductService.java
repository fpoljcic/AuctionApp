package ba.atlantbh.auctionapp.services;

import ba.atlantbh.auctionapp.exceptions.NotFoundException;
import ba.atlantbh.auctionapp.models.Photo;
import ba.atlantbh.auctionapp.models.Product;
import ba.atlantbh.auctionapp.projections.FullProductProj;
import ba.atlantbh.auctionapp.projections.ProductCountProj;
import ba.atlantbh.auctionapp.projections.SimpleProductProj;
import ba.atlantbh.auctionapp.repositories.PhotoRepository;
import ba.atlantbh.auctionapp.repositories.ProductRepository;
import ba.atlantbh.auctionapp.responses.*;
import ba.atlantbh.auctionapp.security.JwtTokenUtil;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.JpaSort;
import org.springframework.stereotype.Service;

import java.util.*;

@AllArgsConstructor
@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final PhotoRepository photoRepository;

    public List<SimpleProductProj> getFeaturedRandomProducts() {
        return productRepository.getFeaturedRandomProducts();
    }

    public List<SimpleProductProj> getNewProducts() {
        return productRepository.getNewProducts();
    }

    public List<SimpleProductProj> getLastProducts() {
        return productRepository.getLastProducts();
    }

    public ProductResponse getProduct(String productId, String userId) {
        FullProductProj product = productRepository.getProduct(productId, userId)
                .orElseThrow(() -> new NotFoundException("Wrong product id"));
        List<Photo> productPhotos = photoRepository.findAllByProductIdOrderByFeaturedDesc(UUID.fromString(productId));
        return new ProductResponse(product, productPhotos);
    }

    public List<SimpleProductProj> getRelatedProducts(String id) {
        Product product = productRepository.findById(UUID.fromString(id))
                .orElseThrow(() -> new NotFoundException("Wrong product id"));
        return productRepository.getRelatedProducts(id, product.getSubcategory().getId().toString(),
                product.getSubcategory().getCategory().getId().toString());
    }

    public ProductPageResponse search(String query, String category, String subcategory, Integer page, String sort) {
        PageRequest pageRequest;
        switch (sort) {
            case "popularity":
                pageRequest = PageRequest.of(page, 12, JpaSort.unsafe(Sort.Direction.DESC, "(bids)"));
                break;
            case "new":
                pageRequest = PageRequest.of(page, 12, Sort.by("start_date").descending());
                break;
            case "price":
                pageRequest = PageRequest.of(page, 12, Sort.by("start_price"));
                break;
            default:
                pageRequest = PageRequest.of(page, 12, Sort.by("name").and(Sort.by("id")));
                break;
        }

        UUID id = JwtTokenUtil.getRequestPersonId();

        Slice<SimpleProductProj> searchResult = productRepository.search(
                query,
                category,
                subcategory,
                id == null ? "" : id.toString(),
                pageRequest
        );
        return new ProductPageResponse(searchResult.getContent(), !searchResult.hasNext());
    }

    public List<CategoryCountReponse> searchCount(String query) {
        List<ProductCountProj> productCounts = productRepository.searchCount(query);
        List<CategoryCountReponse> response = new ArrayList<>();

        Set<CountResponse> subcategoryCount = new TreeSet<>();
        for (ProductCountProj productCount : productCounts) {
            if (productCount.getSubcategoryName() != null) {
                subcategoryCount.add(new CountResponse(productCount.getSubcategoryName(), productCount.getCount()));
            } else if (productCount.getCategoryName() != null) {
                response.add(new CategoryCountReponse(productCount.getCategoryName(), productCount.getCount(), subcategoryCount));
                subcategoryCount = new TreeSet<>();
            }
        }

        response.sort(Comparator.comparing(CategoryCountReponse::getCount).reversed());

        return response;
    }
}
