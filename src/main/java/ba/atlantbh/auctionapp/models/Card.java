package ba.atlantbh.auctionapp.models;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
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
    @Column(nullable = false)
    private String name;

    @NotBlank
    @Column(nullable = false)
    @Size(max = 19)
    @Size(min = 13)
    private String cardNumber;

    @Column(nullable = false)
    @Min(2000)
    @Max(9999)
    private Integer expirationYear;

    @Column(nullable = false)
    @Min(1)
    @Max(12)
    private Integer expirationMonth;

    @Column(nullable = false)
    @Min(100)
    @Max(9999)
    private Short cvc;

    @ManyToOne
    @JoinColumn(name = "person_id")
    private Person person;

    public Card(@NotBlank String name, @NotBlank @Size(max = 19) @Size(min = 13) String cardNumber, @Min(2000) @Max(9999) Integer expirationYear, @Min(1) @Max(12) Integer expirationMonth, @Min(100) @Max(9999) Short cvc) {
        this.name = name;
        this.cardNumber = cardNumber;
        this.expirationYear = expirationYear;
        this.expirationMonth = expirationMonth;
        this.cvc = cvc;
    }
}
