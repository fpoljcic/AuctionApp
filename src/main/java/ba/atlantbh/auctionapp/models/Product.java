package ba.atlantbh.auctionapp.models;

import ba.atlantbh.auctionapp.models.enums.Color;
import ba.atlantbh.auctionapp.models.enums.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import javax.validation.constraints.DecimalMax;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
public class Product {
    @Id
    @Type(type="uuid-char")
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID id;

    @CreationTimestamp
    @Column(nullable = false)
    private LocalDateTime dateCreated;

    @NotBlank
    @Column(nullable = false)
    @javax.validation.constraints.Size(max = 60)
    private String name;

    @Column(columnDefinition = "TEXT")
    @javax.validation.constraints.Size(max = 700)
    private String description;

    @DecimalMin("0.50")
    @DecimalMax("999999.99")
    @Column(precision = 8, scale = 2, nullable = false)
    private BigDecimal startPrice;

    @Column(nullable = false)
    private LocalDateTime startDate;

    @Column(nullable = false)
    private LocalDateTime endDate;

    @NotBlank
    @Column(nullable = false)
    private String street;

    @NotBlank
    @Column(nullable = false)
    private String city;

    @NotBlank
    @Column(nullable = false)
    @javax.validation.constraints.Size(max = 32)
    private String zip;

    @NotBlank
    @Column(nullable = false)
    private String country;

    @NotBlank
    @Column(nullable = false)
    @javax.validation.constraints.Size(max = 32)
    private String phone;

    @Column(nullable = false)
    private Boolean shipping = false;

    @Column(nullable = false)
    private Boolean featured = false;

    @Column(nullable = false)
    private Boolean rated = false;

    @Column(nullable = false)
    private Boolean notified = false;

    @Enumerated(EnumType.STRING)
    private Color color;

    @Enumerated(EnumType.STRING)
    private Size size;

    @ManyToOne
    @JoinColumn(name = "person_id", nullable = false)
    private Person person;

    @ManyToOne
    @JoinColumn(name = "subcategory_id", nullable = false)
    private Subcategory subcategory;

    public Product(@NotBlank String name, @Min(value = 0) BigDecimal startPrice, LocalDateTime startDate, LocalDateTime endDate, @NotBlank String street, @NotBlank String city, @NotBlank String zip, @NotBlank String country, @NotBlank String phone, Person person, Subcategory subcategory) {
        this.name = name;
        this.startPrice = startPrice;
        this.startDate = startDate;
        this.endDate = endDate;
        this.street = street;
        this.city = city;
        this.zip = zip;
        this.country = country;
        this.phone = phone;
        this.person = person;
        this.subcategory = subcategory;
    }
}
