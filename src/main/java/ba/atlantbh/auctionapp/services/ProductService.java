package ba.atlantbh.auctionapp.services;

import ba.atlantbh.auctionapp.exceptions.NotFoundException;
import ba.atlantbh.auctionapp.models.Product;
import ba.atlantbh.auctionapp.models.enums.Color;
import ba.atlantbh.auctionapp.models.enums.Size;
import ba.atlantbh.auctionapp.projections.*;
import ba.atlantbh.auctionapp.repositories.PhotoRepository;
import ba.atlantbh.auctionapp.repositories.ProductRepository;
import ba.atlantbh.auctionapp.responses.*;
import ba.atlantbh.auctionapp.security.JwtTokenUtil;
import com.atlascopco.hunspell.Hunspell;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.JpaSort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@AllArgsConstructor
@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final PhotoRepository photoRepository;
    private final Hunspell speller;

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
        List<SimplePhotoProj> productPhotos = photoRepository.findAllByProductIdOrderByFeaturedDesc(UUID.fromString(productId));
        return new ProductResponse(product, productPhotos);
    }

    public List<SimpleProductProj> getRelatedProducts(String id) {
        Product product = productRepository.findById(UUID.fromString(id))
                .orElseThrow(() -> new NotFoundException("Wrong product id"));
        return productRepository.getRelatedProducts(id, product.getSubcategory().getId().toString(),
                product.getSubcategory().getCategory().getId().toString());
    }

    private String getSuggestion(String query) {
        String[] queryWords = query.split(" ");
        List<String> suggestedWords = new ArrayList<>(queryWords.length);
        for (String queryWord : queryWords) {
            if (!speller.spell(queryWord)) {
                List<String> suggestions = speller.suggest(queryWord);
                if (suggestions.isEmpty())
                    suggestedWords.add(queryWord);
                else
                    suggestedWords.add(suggestions.get(0));
            } else
                suggestedWords.add(queryWord);
        }
        return String.join(" ", suggestedWords);
    }

    public ProductPageResponse search(String query, String category, String subcategory, Integer page, String sort,
                                      Integer minPrice, Integer maxPrice, Color color, Size size) {
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
                pageRequest = PageRequest.of(page, 12, JpaSort.unsafe(Sort.Direction.DESC, "(similarity)")
                        .and(Sort.by("name")).and(Sort.by("id")));
                break;
        }

        UUID id = JwtTokenUtil.getRequestPersonId();

        Slice<SimpleProductProj> searchResult = productRepository.search(
                query,
                formTsQuery(query),
                category,
                subcategory,
                id == null ? "" : id.toString(),
                minPrice,
                maxPrice,
                color == null ? "" : color.toString(),
                size == null ? "" : size.toString(),
                pageRequest
        );
        return new ProductPageResponse(searchResult.getContent(), !searchResult.hasNext(), getSuggestion(query));
    }

    public List<CategoryCountReponse> searchCount(String query, Integer minPrice, Integer maxPrice, Color color, Size size) {
        List<ProductCountProj> productCounts = productRepository.categoryCount(
                query,
                formTsQuery(query),
                minPrice,
                maxPrice,
                color == null ? "" : color.toString(),
                size == null ? "" : size.toString()
        );
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

    public FilterCountResponse filterCount(String query, String category, String subcategory,
                                           Integer minPrice, Integer maxPrice, Color color, Size size) {
        List<ColorCountProj> colors = productRepository.colorCount(
                query,
                formTsQuery(query),
                category,
                subcategory,
                minPrice,
                maxPrice,
                size == null ? "" : size.toString()
        );
        List<SizeCountProj> sizes = productRepository.sizeCount(
                query,
                formTsQuery(query),
                category,
                subcategory,
                minPrice,
                maxPrice,
                color == null ? "" : color.toString()
        );
        List<BigDecimal> prices = productRepository.prices(
                query,
                formTsQuery(query),
                category,
                subcategory,
                color == null ? "" : color.toString(),
                size == null ? "" : size.toString()
        );
        PriceCountResponse price = getPriceInfo(prices, 24);
        return new FilterCountResponse(colors, sizes, price);
    }

    private PriceCountResponse getPriceInfo(List<BigDecimal> prices, int bars) {
        if (prices.isEmpty())
            return new PriceCountResponse(BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, new int[bars]);
        if (prices.size() == 1)
            return new PriceCountResponse(prices.get(0), prices.get(0), prices.get(0), new int[bars]);
        PriceCountResponse price = new PriceCountResponse();
        price.setMinPrice(prices.get(0));
        price.setMaxPrice(prices.get(prices.size() - 1));
        price.setAvgPrice(average(prices, RoundingMode.HALF_UP));
        price.setPrices(priceHistogram(prices, prices.get(0), prices.get(prices.size() - 1), bars));
        return price;
    }

    private int[] priceHistogram(List<BigDecimal> prices, BigDecimal min, BigDecimal max, int bars) {
        int[] pricesCount = new int[bars];
        BigDecimal divider = max.subtract(min).divide(new BigDecimal(bars - 1), 8, RoundingMode.HALF_UP);

        for (BigDecimal price : prices) {
            ++pricesCount[price.subtract(min).divide(divider, 0, RoundingMode.HALF_UP).intValue()];
        }

        return pricesCount;
    }

    private BigDecimal average(List<BigDecimal> bigDecimals, RoundingMode roundingMode) {
        BigDecimal sum = bigDecimals.stream()
                .map(Objects::requireNonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return sum.divide(new BigDecimal(bigDecimals.size()), roundingMode);
    }

    private String formTsQuery(String query) {
        return query.replaceAll("[\\p{P}\\p{S}]", "").trim().replace(" ", " & ");
    }
}
