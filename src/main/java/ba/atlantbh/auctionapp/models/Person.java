package ba.atlantbh.auctionapp.models;

import ba.atlantbh.auctionapp.models.enums.Gender;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Person {
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
    @Size(max = 100)
    @Size(min = 2)
    private String firstName;

    @NotBlank
    @Column(nullable = false)
    @Size(max = 100)
    @Size(min = 2)
    private String lastName;

    @NotBlank
    @Column(nullable = false, unique = true)
    @Size(max = 100)
    private String email;

    @NotBlank
    @Column(nullable = false)
    private String password;

    private String photo = "https://i.imgur.com/O0O16un.gif";
    @Enumerated(EnumType.STRING)
    private Gender gender;
    private LocalDateTime dateOfBirth;
    @Size(max = 32)
    private String phone;
    private Boolean verified = false;

    private String street;
    private String city;
    @Size(max = 32)
    private String zip;
    private String state;
    private String country;

    @Column(nullable = false)
    private Boolean active = true;

    private String stripeCustomerId;

    @DecimalMin("0")
    @DecimalMax("5")
    @Column(precision = 7, scale = 6, nullable = false)
    private BigDecimal rating = BigDecimal.ZERO;
    @Min(0)
    @Column(nullable = false)
    private Integer ratingCount = 0;

    public Person(@NotBlank @Size(max = 100) @Size(min = 2) String firstName, @NotBlank @Size(max = 100) @Size(min = 2) String lastName, @NotBlank @Size(max = 100) String email, @NotBlank String password) {
        setFirstName(firstName);
        setLastName(lastName);
        this.email = email;
        this.password = password;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName.trim().replaceAll("\\s+"," ");
    }

    public void setLastName(String lastName) {
        this.lastName = lastName.trim().replaceAll("\\s+"," ");
    }
}
