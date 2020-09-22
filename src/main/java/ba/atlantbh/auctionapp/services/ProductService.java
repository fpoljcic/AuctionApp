package ba.atlantbh.auctionapp.services;

import ba.atlantbh.auctionapp.models.Product;
import ba.atlantbh.auctionapp.repositories.ProductRepository;
import ba.atlantbh.auctionapp.responses.EssentialProductInfoResponse;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<EssentialProductInfoResponse> getFeaturedRandomProducts() {
        List<Product> featuredRandomProducts = productRepository.getFeaturedRandomProducts();
        return featuredRandomProducts.stream().map(product -> new EssentialProductInfoResponse(
                product.getId(),
                product.getName(),
                product.getStartPrice(),
                product.getDescription(),
                product.getPhotos().get(0).getUrl()
        )).collect(Collectors.toList());
    }

    public List<EssentialProductInfoResponse> getNewProducts() {
        List<Product> newProducts = productRepository.getNewProducts();
        return newProducts.stream().map(product -> new EssentialProductInfoResponse(
                product.getId(),
                product.getName(),
                product.getStartPrice(),
                product.getDescription(),
                product.getPhotos().get(0).getUrl()
        )).collect(Collectors.toList());
    }

    public List<EssentialProductInfoResponse> getLastProducts() {
        List<Product> lastProducts = productRepository.getLastProducts();
        return lastProducts.stream().map(product -> new EssentialProductInfoResponse(
                product.getId(),
                product.getName(),
                product.getStartPrice(),
                product.getDescription(),
                product.getPhotos().get(0).getUrl()
        )).collect(Collectors.toList());
    }
}
