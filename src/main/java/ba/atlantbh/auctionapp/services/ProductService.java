package ba.atlantbh.auctionapp.services;

import ba.atlantbh.auctionapp.repositories.ProductRepository;
import ba.atlantbh.auctionapp.responses.SimpleProductResponse;
import org.springframework.stereotype.Service;

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
}
