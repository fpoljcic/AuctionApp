package ba.atlantbh.auctionapp.models;

import ba.atlantbh.auctionapp.models.enums.Gender;
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
    private String firstName;

    @NotBlank
    private String lastName;

    @NotBlank
    @Column(unique = true)
    private String email;

    @NotBlank
    private String password;

    private String photo = "http://www.gnd.center/bpm/resources/img/avatar-placeholder.gif";
    @Enumerated(EnumType.STRING)
    private Gender gender;
    private LocalDateTime dateOfBirth;
    private String phone;

    private String street;
    private String city;
    private Integer zip;
    private String state;
    private String country;

    @Column(nullable = false)
    private Boolean active = true;

    public Person(@NotBlank String firstName, @NotBlank String lastName, @NotBlank String email, @NotBlank String password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
    }
}
