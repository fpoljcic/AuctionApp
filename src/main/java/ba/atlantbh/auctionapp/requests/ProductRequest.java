package ba.atlantbh.auctionapp.requests;

import ba.atlantbh.auctionapp.models.enums.Color;
import ba.atlantbh.auctionapp.models.enums.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
public class ProductRequest {

    @NotBlank(message = "Name can't be blank")
    @javax.validation.constraints.Size(max = 60, message = "Name can't be longer than 60 characters")
    private String name;

    @NotNull(message = "Subcategory id is required")
    private UUID subcategoryId;

    @javax.validation.constraints.Size(max = 700, message = "Description can't be longer than 700 characters")
    private String description;

    private Color color;
    private Size size;

    private List<String> photos;

    @NotNull(message = "Start price is required")
    @DecimalMin(value = "0.01", message = "Start price can't be lower than $0.01")
    @DecimalMax(value = "999999.99", message = "Start price can't be higher than $999999.99")
    private BigDecimal startPrice;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    @NotBlank(message = "Street can't be blank")
    @javax.validation.constraints.Size(max = 255, message = "Address can't be longer than 255 characters")
    private String street;

    @NotBlank(message = "City can't be blank")
    @javax.validation.constraints.Size(max = 255, message = "City can't be longer than 255 characters")
    private String city;

    @NotBlank(message = "Country can't be blank")
    @javax.validation.constraints.Size(max = 255, message = "Country can't be longer than 255 characters")
    private String country;

    @NotNull(message = "Zip can't be blank")
    @javax.validation.constraints.Size(max = 32, message = "Zip code can't be longer than 32 characters")
    private String zip;

    @NotBlank(message = "Phone can't be blank")
    @javax.validation.constraints.Size(max = 100, message = "Phone can't be longer than 255 characters")
    private String phone;

    private Boolean shipping = false;
    private Boolean featured = false;

    private CardRequest card;

    private PayPalRequest payPal;
}
