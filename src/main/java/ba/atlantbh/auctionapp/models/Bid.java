package ba.atlantbh.auctionapp.models;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import javax.validation.constraints.Min;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
public class Bid {
    @Id
    @Type(type="uuid-char")
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID id;

    @CreationTimestamp
    @Column(nullable = false)
    private LocalDateTime date;

    @Column(nullable = false)
    @Min(value = 0)
    private Float price;

    @ManyToOne
    @JoinColumn(name = "person_id", nullable = false)
    private Person person;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    public Bid(LocalDateTime date, Float price, Person person, Product product) {
        this.date = date;
        this.price = price;
        this.person = person;
        this.product = product;
    }

    public Bid(Float price, Person person, Product product) {
        this.price = price;
        this.person = person;
        this.product = product;
    }
}
