package ba.atlantbh.auctionapp.services;

import ba.atlantbh.auctionapp.models.Product;
import ba.atlantbh.auctionapp.repositories.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getFeaturedRandomProducts() {
        return productRepository.getFeaturedRandomProducts();
    }

    public List<Product> getNewProducts() {
        return productRepository.getNewProducts();
    }

    public List<Product> getTopProducts() {
        return productRepository.getTopProducts();
    }

    public List<Product> getLastProducts() {
        return productRepository.getLastProducts();
    }
}
