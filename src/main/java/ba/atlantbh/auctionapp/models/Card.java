package ba.atlantbh.auctionapp.models;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
public class Card {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID id;

    @NotBlank
    private String type;

    @NotBlank
    private String name;

    @NotBlank
    @Column(unique = true)
    private String cardNumber;

    @Column(nullable = false)
    private Integer expirationYear;

    @Column(nullable = false)
    private Integer expirationMonth;

    @Column(nullable = false)
    private Integer cvc;

    @ManyToOne
    @JoinColumn(name = "person_id", nullable = false)
    private Person person;

    public Card(@NotBlank String type, @NotBlank String name, @NotBlank String cardNumber, Integer expirationYear, Integer expirationMonth, Integer cvc, Person person) {
        this.type = type;
        this.name = name;
        this.cardNumber = cardNumber;
        this.expirationYear = expirationYear;
        this.expirationMonth = expirationMonth;
        this.cvc = cvc;
        this.person = person;
    }
}
