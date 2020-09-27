package ba.atlantbh.auctionapp.services;

import ba.atlantbh.auctionapp.exceptions.NotFoundException;
import ba.atlantbh.auctionapp.models.Photo;
import ba.atlantbh.auctionapp.repositories.ProductRepository;
import ba.atlantbh.auctionapp.responses.FullProductResponse;
import ba.atlantbh.auctionapp.responses.ProductResponse;
import ba.atlantbh.auctionapp.responses.SimpleProductResponse;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

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
                fullProducts.get(0).getName(),
                fullProducts.get(0).getDescription(),
                fullProducts.get(0).getStartPrice(),
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
}
