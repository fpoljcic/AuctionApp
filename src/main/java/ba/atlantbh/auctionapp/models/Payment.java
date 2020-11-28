package ba.atlantbh.auctionapp.models;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import javax.validation.constraints.DecimalMax;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
public class Payment {
    @Id
    @Type(type = "uuid-char")
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID id;

    @CreationTimestamp
    @Column(nullable = false)
    private LocalDateTime date;

    @DecimalMin("0.50")
    @DecimalMax("999999.99")
    @Column(precision = 8, scale = 2, nullable = false)
    private BigDecimal amount;

    private String stripeChargeId;

    private String street;
    private String country;
    private String city;
    @Size(max = 32)
    private String zip;
    @Size(max = 32)
    private String phone;

    @ManyToOne
    @JoinColumn(name = "person_id", nullable = false)
    private Person person;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne
    @JoinColumn(name = "card_id")
    private Card card;

    @ManyToOne
    @JoinColumn(name = "paypal_id")
    private PayPal payPal;

    public Payment(@DecimalMin("0.50") @DecimalMax("999999.99") BigDecimal amount, Person person, Product product) {
        this.amount = amount;
        this.person = person;
        this.product = product;
    }
}
