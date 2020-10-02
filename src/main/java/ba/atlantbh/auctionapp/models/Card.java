package ba.atlantbh.auctionapp.models;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
public class Card {
    @Id
    @Type(type="uuid-char")
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
    private Short cvc;

    @ManyToOne
    @JoinColumn(name = "person_id", nullable = false)
    private Person person;

    public Card(@NotBlank String type, @NotBlank String name, @NotBlank String cardNumber, Integer expirationYear, Integer expirationMonth, Short cvc, Person person) {
        this.type = type;
        this.name = name;
        this.cardNumber = cardNumber;
        this.expirationYear = expirationYear;
        this.expirationMonth = expirationMonth;
        this.cvc = cvc;
        this.person = person;
    }
}
