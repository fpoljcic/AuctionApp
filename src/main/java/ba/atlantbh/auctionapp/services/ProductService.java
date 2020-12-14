package ba.atlantbh.auctionapp.services;

import ba.atlantbh.auctionapp.exceptions.BadRequestException;
import ba.atlantbh.auctionapp.exceptions.UnauthorizedException;
import ba.atlantbh.auctionapp.exceptions.UnprocessableException;
import ba.atlantbh.auctionapp.models.*;
import ba.atlantbh.auctionapp.models.enums.Color;
import ba.atlantbh.auctionapp.models.enums.Size;
import ba.atlantbh.auctionapp.projections.*;
import ba.atlantbh.auctionapp.repositories.*;
import ba.atlantbh.auctionapp.requests.CardRequest;
import ba.atlantbh.auctionapp.requests.PayPalRequest;
import ba.atlantbh.auctionapp.requests.PaymentRequest;
import ba.atlantbh.auctionapp.requests.ProductRequest;
import ba.atlantbh.auctionapp.responses.*;
import ba.atlantbh.auctionapp.security.JwtTokenUtil;
import com.atlascopco.hunspell.Hunspell;
import com.stripe.exception.StripeException;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.JpaSort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final PhotoRepository photoRepository;
    private final SubcategoryRepository subcategoryRepository;
    private final PersonRepository personRepository;
    private final CardRepository cardRepository;
    private final PayPalRepository payPalRepository;
    private final BidRepository bidRepository;
    private final PaymentRepository paymentRepository;
    private final Hunspell speller;
    private final StripeService stripeService;

    public List<SimpleProductProj> getFeaturedProducts() {
        String id = "";
        try {
            id = JwtTokenUtil.getRequestPersonId().toString();
        } catch (UnauthorizedException ignore) {
        }
        List<SimpleProductProj> featuredProducts = productRepository.getFeaturedProducts(id, true, 6, false);
        if (featuredProducts.size() < 6)
            featuredProducts.addAll(productRepository.getFeaturedProducts(id, false, 6 - featuredProducts.size(), false));
        if (featuredProducts.size() < 6)
            featuredProducts.addAll(productRepository.getFeaturedProducts(id, true, 6 - featuredProducts.size(), true));
        if (featuredProducts.size() < 6)
            featuredProducts.addAll(productRepository.getFeaturedProducts(id, false, 6 - featuredProducts.size(), true));
        return featuredProducts;
    }

    public List<SimpleProductProj> getNewProducts() {
        return productRepository.getNewProducts();
    }

    public List<SimpleProductProj> getLastProducts() {
        return productRepository.getLastProducts();
    }

    public ProductResponse getProduct(String productId, String userId) {
        FullProductProj product = productRepository.getProduct(productId, userId)
                .orElseThrow(() -> new UnprocessableException("This product does not exist or has been removed by the seller"));
        List<SimplePhotoProj> productPhotos = photoRepository.findAllByProductIdOrderByFeaturedDesc(UUID.fromString(productId));
        return new ProductResponse(product, productPhotos);
    }

    public List<SimpleProductProj> getRelatedProducts(String id) {
        Product product = productRepository.findByIdAndIsActive(id)
                .orElseThrow(() -> new UnprocessableException("Wrong product id"));
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
        String[] sortCriterias = sort.split("_");
        Sort.Direction sortOrder = Sort.Direction.DESC;
        if (sortCriterias.length > 1 && sortCriterias[1].equals("asc"))
            sortOrder = Sort.Direction.ASC;
        switch (sortCriterias[0]) {
            case "popularity":
                pageRequest = PageRequest.of(page, 12, JpaSort.unsafe(sortOrder, "(bids)"));
                break;
            case "new":
                pageRequest = PageRequest.of(page, 12, JpaSort.unsafe(sortOrder, "(pr.start_date)"));
                break;
            case "price":
                pageRequest = PageRequest.of(page, 12, JpaSort.unsafe(sortOrder, "(pr.start_price)"));
                break;
            default:
                pageRequest = PageRequest.of(page, 12, JpaSort.unsafe(Sort.Direction.DESC, "(similarity)")
                        .and(JpaSort.unsafe("(pr.name)")).and(JpaSort.unsafe("(pr.id)")));
                break;
        }

        UUID id = null;
        try {
            id = JwtTokenUtil.getRequestPersonId();
        } catch (UnauthorizedException ignore) {

        }

        String tsQuery = formTsQuery(query);
        Slice<SimpleProductProj> searchResult = productRepository.search(
                query,
                tsQuery,
                category,
                subcategory,
                id == null ? "" : id.toString(),
                minPrice,
                maxPrice,
                color == null ? "" : color.toString(),
                size == null ? "" : size.toString(),
                pageRequest
        );

        String suggestion = getSuggestion(query);
        String suggestionTsQuery = formTsQuery(query);
        if (suggestion.toLowerCase().equals(query.toLowerCase()) || !productRepository.searchExists(suggestion, suggestionTsQuery)) {
            suggestion = query;
        }

        return new ProductPageResponse(searchResult.getContent(), !searchResult.hasNext(), suggestion);
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
            if (divider.compareTo(BigDecimal.ZERO) == 0)
                continue;
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
        return query.replaceAll("[\\p{P}\\p{S}]", "")
                .replaceAll("\\s+", " ")
                .trim()
                .replace(" ", " | ");
    }

    private void payWithCard(BigDecimal amount, CardRequest cardRequest, Person person, Product product,
                             String description, Optional<PaymentRequest> paymentRequest) {
        Card card = getAndSaveCard(cardRequest, person);
        String chargeId;
        try {
            chargeId = stripeService.pay(
                    amount.multiply(BigDecimal.valueOf(100)).intValue(),
                    person.getStripeCustomerId(),
                    card.getStripeCardId(),
                    description
            );
            Payment payment = new Payment(amount, person, product);
            payment.setCard(card);
            payment.setStripeChargeId(chargeId);
            paymentRequest.ifPresent(payRequest -> {
                payment.setStreet(payRequest.getStreet());
                payment.setCountry(payRequest.getCountry());
                payment.setCity(payRequest.getCity());
                payment.setZip(payRequest.getZip());
                payment.setPhone(payRequest.getPhone());
            });
            paymentRepository.save(payment);
        } catch (StripeException e) {
            throw new BadRequestException(e.getStripeError().getMessage());
        }
    }

    private void payWithPayPal(BigDecimal amount, PayPalRequest payPalRequest, Person person, Product product,
                               Optional<PaymentRequest> paymentRequest) {
        PayPal payPal = getAndSavePayPal(payPalRequest);
        Payment payment = new Payment(amount, person, product);
        paymentRequest.ifPresent(payRequest -> {
            payment.setStreet(payRequest.getStreet());
            payment.setCountry(payRequest.getCountry());
            payment.setCity(payRequest.getCity());
            payment.setZip(payRequest.getZip());
            payment.setPhone(payRequest.getPhone());
        });
        payment.setPayPal(payPal);
        paymentRepository.save(payment);
    }

    public UUID add(ProductRequest productRequest) {
        Subcategory subcategory = subcategoryRepository.findById(productRequest.getSubcategoryId())
                .orElseThrow(() -> new UnprocessableException("Wrong subcategory id"));
        UUID personId = JwtTokenUtil.getRequestPersonId();
        Person person = personRepository.findById(personId)
                .orElseThrow(() -> new UnauthorizedException("Wrong person id"));

        if (productRequest.getEndDate().isBefore(LocalDateTime.now()))
            throw new BadRequestException("End date can't be before current date");
        if (!productRequest.getEndDate().isAfter(productRequest.getStartDate()))
            throw new BadRequestException("End date must be after start date");

        CardRequest cardRequest = productRequest.getCard();
        PayPalRequest payPalRequest = productRequest.getPayPal();
        if (productRequest.getFeatured() && cardRequest == null && payPalRequest == null)
            throw new BadRequestException("Featured products must have payment details");
        if (productRequest.getShipping() && cardRequest == null && payPalRequest == null)
            throw new BadRequestException("Products with shipping must have payment details");
        if (cardRequest != null && payPalRequest != null)
            throw new BadRequestException("Conflicting payment details");

        Product product = new Product(
                productRequest.getName(),
                productRequest.getStartPrice(),
                productRequest.getStartDate(),
                productRequest.getEndDate(),
                productRequest.getStreet(),
                productRequest.getCity(),
                productRequest.getZip(),
                productRequest.getCountry(),
                productRequest.getPhone(),
                person,
                subcategory
        );
        product.setDescription(productRequest.getDescription());
        product.setColor(productRequest.getColor());
        product.setSize(productRequest.getSize());
        product.setFeatured(productRequest.getFeatured());
        product.setShipping(productRequest.getShipping());

        Product savedProduct = productRepository.save(product);

        BigDecimal amount = BigDecimal.ZERO;
        String description = person.getFirstName() + " " + person.getLastName() + " (" + person.getId() + ") paid for ";
        if (productRequest.getShipping()) {
            amount = amount.add(BigDecimal.valueOf(10));
            description += "shipping";
        }
        if (productRequest.getFeatured()) {
            if (productRequest.getShipping())
                description += ", ";
            description += "featuring";
            amount = amount.add(BigDecimal.valueOf(5));
        }
        description += " " + product.getName() + " (" + product.getId() + ")";

        if (!amount.equals(BigDecimal.ZERO)) {
            if (payPalRequest != null)
                payWithPayPal(amount, payPalRequest, person, product, Optional.empty());
            else
                payWithCard(amount, cardRequest, person, savedProduct, description, Optional.empty());
        }

        savePhotos(productRequest.getPhotos(), savedProduct);
        return savedProduct.getId();
    }

    private Card getAndSaveCard(CardRequest cardRequest, Person person) {
        Card card = null;
        if (cardRequest != null) {
            if (cardRequest.getExpirationYear() < Calendar.getInstance().get(Calendar.YEAR) ||
                    cardRequest.getExpirationYear() == Calendar.getInstance().get(Calendar.YEAR) &&
                            cardRequest.getExpirationMonth() < Calendar.getInstance().get(Calendar.MONTH) + 1)
                throw new BadRequestException("Entered card has expired");
            if (!cardRequest.getCardNumber().matches("^(\\d*)$")) {
                Card existingCard = cardRepository.findByPersonIdAndSavedIsTrue(person.getId())
                        .orElseThrow(() -> new BadRequestException("Card number can only contain digits"));
                if (!existingCard.getMaskedCardNumber().equals(cardRequest.getCardNumber()))
                    throw new BadRequestException("Card number can only contain digits");
                if (!existingCard.getName().equals(cardRequest.getName()) ||
                        !existingCard.getExpirationYear().equals(cardRequest.getExpirationYear()) ||
                        !existingCard.getExpirationMonth().equals(cardRequest.getExpirationMonth()) ||
                        !existingCard.getCvc().equals(cardRequest.getCvc()))
                    throw new BadRequestException("Wrong card info");
                return existingCard;
            }
            card = cardRepository.findByNameAndCardNumberAndExpirationYearAndExpirationMonthAndCvcAndPerson(
                    cardRequest.getName(),
                    cardRequest.getCardNumber(),
                    cardRequest.getExpirationYear(),
                    cardRequest.getExpirationMonth(),
                    cardRequest.getCvc(),
                    person
            ).orElseGet(() -> {
                Card newCard = new Card(
                        cardRequest.getName(),
                        cardRequest.getCardNumber(),
                        cardRequest.getExpirationYear(),
                        cardRequest.getExpirationMonth(),
                        cardRequest.getCvc(),
                        person,
                        false
                );
                String stripeCardId;
                try {
                    stripeCardId = stripeService.saveCard(newCard, person, false);
                } catch (StripeException e) {
                    throw new BadRequestException(e.getStripeError().getMessage());
                }
                newCard.setStripeCardId(stripeCardId);
                cardRepository.save(newCard);
                return newCard;
            });
        }
        return card;
    }

    private PayPal getAndSavePayPal(PayPalRequest payPalRequest) {
        PayPal payPal = null;
        if (payPalRequest != null) {
            payPal = payPalRepository.save(new PayPal(payPalRequest.getOrderId()));
        }
        return payPal;
    }

    private void savePhotos(List<String> photoUrls, Product product) {
        if (photoUrls == null || photoUrls.isEmpty())
            return;
        List<Photo> photos = photoUrls.stream().map(url -> new Photo(url, product)).collect(Collectors.toList());
        photos.get(0).setFeatured(true);
        photoRepository.saveAll(photos);
    }

    public List<UserProductProj> getUserProducts() {
        UUID personId = JwtTokenUtil.getRequestPersonId();
        return productRepository.getUserProducts(personId.toString());
    }

    public List<UserProductProj> getUserBidProducts() {
        UUID personId = JwtTokenUtil.getRequestPersonId();
        return productRepository.getUserBidProducts(personId.toString());
    }

    public List<UserProductProj> getUserWishlistProducts() {
        UUID personId = JwtTokenUtil.getRequestPersonId();
        return productRepository.getUserWishlistProducts(personId.toString());
    }

    public void pay(PaymentRequest paymentRequest) {
        UUID personId = JwtTokenUtil.getRequestPersonId();
        Person person = personRepository.findById(personId)
                .orElseThrow(() -> new UnauthorizedException("Wrong person id"));

        Product product = productRepository.findByIdAndIsActive(paymentRequest.getProductId().toString())
                .orElseThrow(() -> new UnprocessableException("Wrong product id"));

        if (product.getEndDate().isAfter(LocalDateTime.now()))
            throw new BadRequestException("Auction hasn't ended for this product");

        CardRequest cardRequest = paymentRequest.getCard();
        PayPalRequest payPalRequest = paymentRequest.getPayPal();
        if (cardRequest == null && payPalRequest == null)
            throw new BadRequestException("Payment details missing");
        if (cardRequest != null && payPalRequest != null)
            throw new BadRequestException("Conflicting payment details");

        Bid bid = bidRepository.getHighestBidForProduct(product.getId().toString())
                .orElseThrow(() -> new BadRequestException("This product doesn't have any bids"));
        if (!bid.getPerson().getId().equals(person.getId()))
            throw new BadRequestException("You aren't the highest bidder for this product");

        boolean alreadyPaid = paymentRepository.isProductPaidByUser(person.getId().toString(), product.getId().toString());
        if (alreadyPaid)
            throw new BadRequestException("You already paid for this product");

        if (cardRequest != null) {
            String description = person.getFirstName() + " " + person.getLastName() + " (" + person.getId() + ") "
                    + "paid for " + product.getName() + " (" + product.getId() + ")";
            payWithCard(bid.getPrice(), cardRequest, person, product, description, Optional.of(paymentRequest));
        } else {
            payWithPayPal(bid.getPrice(), payPalRequest, person, product, Optional.of(paymentRequest));
        }
    }

    public void rate(UUID productId, Integer rating) {
        UUID personId = JwtTokenUtil.getRequestPersonId();
        Product product = productRepository.findByIdAndIsActive(productId.toString())
                .orElseThrow(() -> new UnprocessableException("Wrong product id"));

        if (product.getRated())
            throw new BadRequestException("You already rated this product");
        if (!paymentRepository.isProductPaidByUser(personId.toString(), productId.toString()))
            throw new BadRequestException("You didn't pay for this product");

        Person sellerPerson = product.getPerson();
        Integer oldRatingCount = sellerPerson.getRatingCount();
        BigDecimal newRating = ((sellerPerson.getRating().multiply(BigDecimal.valueOf(oldRatingCount))).add(BigDecimal.valueOf(rating)))
                .divide(BigDecimal.valueOf(oldRatingCount + 1), RoundingMode.HALF_UP);

        sellerPerson.setRating(newRating);
        sellerPerson.setRatingCount(oldRatingCount + 1);
        product.setRated(true);
        productRepository.save(product);
    }
}
