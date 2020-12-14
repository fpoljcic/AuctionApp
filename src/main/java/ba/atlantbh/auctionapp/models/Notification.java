package ba.atlantbh.auctionapp.models;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
public class Notification {
    @Id
    @Type(type = "uuid-char")
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID id;

    @CreationTimestamp
    @Column(nullable = false)
    private LocalDateTime date;

    @NotBlank
    @Column(nullable = false)
    private String type;

    @NotBlank
    @Column(nullable = false)
    private String description;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne
    @JoinColumn(name = "person_id", nullable = false)
    private Person person;

    @Column(nullable = false)
    private Boolean checked = false;

    public Notification(@NotBlank String type, @NotBlank String description, Product product, Person person) {
        this.type = type;
        this.description = description;
        this.product = product;
        this.person = person;
    }
}
