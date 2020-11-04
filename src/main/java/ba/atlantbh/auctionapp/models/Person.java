package ba.atlantbh.auctionapp.models;

import ba.atlantbh.auctionapp.models.enums.Gender;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
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

    private String photo = "http://www.gnd.center/bpm/resources/img/avatar-placeholder.gif";
    @Enumerated(EnumType.STRING)
    private Gender gender;
    private LocalDateTime dateOfBirth;
    @Size(max = 32)
    private String phone;

    private String street;
    private String city;
    @Size(max = 32)
    private String zip;
    private String state;
    private String country;

    @Column(nullable = false)
    private Boolean active = true;

    public Person(@NotBlank @Size(max = 100) @Size(min = 2) String firstName, @NotBlank @Size(max = 100) @Size(min = 2) String lastName, @NotBlank @Size(max = 100) String email, @NotBlank String password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
    }
}
