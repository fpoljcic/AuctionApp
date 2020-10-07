package ba.atlantbh.auctionapp.services;

import ba.atlantbh.auctionapp.exceptions.NotFoundException;
import ba.atlantbh.auctionapp.models.Photo;
import ba.atlantbh.auctionapp.models.Product;
import ba.atlantbh.auctionapp.repositories.ProductRepository;
import ba.atlantbh.auctionapp.responses.FullProductResponse;
import ba.atlantbh.auctionapp.responses.ProductPageResponse;
import ba.atlantbh.auctionapp.responses.ProductResponse;
import ba.atlantbh.auctionapp.responses.SimpleProductResponse;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.JpaSort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@Service
public class ProductService {

    private final ProductRepository productRepository;

    public List<SimpleProductResponse> getFeaturedRandomProducts() {
        return productRepository.getFeaturedRandomProducts();
    }

    public List<SimpleProductResponse> getNewProducts() {
        return productRepository.getNewProducts();
    }

    public List<SimpleProductResponse> getLastProducts() {
        return productRepository.getLastProducts();
    }

    public ProductResponse getProduct(String productId, String userId) {
        List<FullProductResponse> fullProducts = productRepository.getProduct(productId, userId);
        if (fullProducts.isEmpty())
            throw new NotFoundException("Wrong product id");

        ProductResponse productResponse = new ProductResponse(
                fullProducts.get(0).getId(),
                fullProducts.get(0).getPersonId(),
                fullProducts.get(0).getName(),
                fullProducts.get(0).getDescription(),
                fullProducts.get(0).getStartPrice(),
                fullProducts.get(0).getStartDate(),
                fullProducts.get(0).getEndDate(),
                fullProducts.get(0).getWished(),
                new ArrayList<>());

        if (fullProducts.get(0).getPhotoId() != null) {
            for (var fullProductResponse : fullProducts) {
                productResponse.getPhotos().add(new Photo(
                        fullProductResponse.getPhotoId(),
                        fullProductResponse.getPhotoUrl(),
                        fullProductResponse.getPhotoFeatured()
                ));
            }
        }

        return productResponse;
    }

    public List<SimpleProductResponse> getRelatedProducts(String id) {
        Product product = productRepository.findById(UUID.fromString(id))
                .orElseThrow(() -> new NotFoundException("Wrong product id"));
        return productRepository.getRelatedProducts(id, product.getSubcategory().getId().toString(),
                product.getSubcategory().getCategory().getId().toString());
    }

    public ProductPageResponse search(String query, Integer page, String sort) {
        PageRequest pageRequest;
        switch (sort) {
            case "popularity":
                pageRequest = PageRequest.of(page, 12, JpaSort.unsafe(Sort.Direction.DESC, "(bids)"));
                break;
            case "new":
                pageRequest = PageRequest.of(page, 12, Sort.by("date_created").descending());
                break;
            case "price":
                pageRequest = PageRequest.of(page, 12, Sort.by("start_price"));
                break;
            default:
                pageRequest = PageRequest.of(page, 12, Sort.by("name").and(Sort.by("id")));
                break;
        }

        Slice<SimpleProductResponse> searchResult = productRepository.search(query.toLowerCase(), pageRequest);
        return new ProductPageResponse(searchResult.getContent(), !searchResult.hasNext());
    }
}
