package ba.atlantbh.auctionapp.security;

import ba.atlantbh.auctionapp.models.Person;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.Serializable;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtTokenUtil implements Serializable {

    private static int jwtExpirationInMs;

    private static String jwtSecret;

    @Value("${app.jwtExpirationInMs}")
    public void setJwtExpirationInMs(int jwtExpirationInMs) {
        JwtTokenUtil.jwtExpirationInMs = jwtExpirationInMs;
    }

    @Value("${app.jwtSecret}")
    public void setJwtSecret(String jwtSecret) {
        JwtTokenUtil.jwtSecret = jwtSecret;
    }

    public String getEmailFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    public Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }

    public String getIdFromToken(String token) {
        return getClaimFromToken(token, (claims -> claims.get("id", String.class)));
    }

    public String generateToken(Person person) {
        return Jwts.builder()
                .claim("id", person.getId())
                .setSubject(person.getEmail())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationInMs))
                .signWith(SignatureAlgorithm.HS512, jwtSecret).compact();
    }

    public Boolean validateToken(String token, PersonDetails personDetails) {
        final String email = getEmailFromToken(token);
        return (email.equals(personDetails.getUsername()) && !isTokenExpired(token));
    }

    private Boolean isTokenExpired(String token) {
        final Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }

    private <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody();
        return claimsResolver.apply(claims);
    }
}
