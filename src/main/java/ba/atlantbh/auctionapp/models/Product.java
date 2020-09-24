package ba.atlantbh.auctionapp.models;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.List;
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
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Integer startPrice;

    @Column(nullable = false)
    private LocalDateTime startDate;

    @Column(nullable = false)
    private LocalDateTime endDate;

    @NotBlank
    private String street;

    @NotBlank
    private String city;

    @Column(nullable = false)
    private Integer zip;

    @NotBlank
    private String country;

    @NotBlank
    private String phone;

    @Column(nullable = false)
    private Boolean shipping = false;

    @Column(nullable = false)
    private Boolean featured = false;

    @ManyToOne
    @JoinColumn(name = "person_id", nullable = false)
    private Person person;

    @ManyToOne
    @JoinColumn(name = "subcategory_id", nullable = false)
    private Subcategory subcategory;

    @ManyToOne
    @JoinColumn(name = "card_id")
    private Card card;

    @OneToMany
    @JoinColumn(name = "product_id")
    private List<Photo> photos;

    public Product(@NotBlank String name, Integer startPrice, LocalDateTime startDate, LocalDateTime endDate, @NotBlank String street, @NotBlank String city, Integer zip, @NotBlank String country, @NotBlank String phone, Person person, Subcategory subcategory) {
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
