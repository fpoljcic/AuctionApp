package ba.atlantbh.auctionapp.services;

import ba.atlantbh.auctionapp.repositories.ProductRepository;
import ba.atlantbh.auctionapp.responses.EssentialProductInfoResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<EssentialProductInfoResponse> getFeaturedRandomProducts() {
        return productRepository.getFeaturedRandomProducts();
    }

    public List<EssentialProductInfoResponse> getNewProducts() {
        return productRepository.getNewProducts();
    }

    public List<EssentialProductInfoResponse> getLastProducts() {
        return productRepository.getLastProducts();
    }
}
