package ba.atlantbh.auctionapp.security;

import ba.atlantbh.auctionapp.models.Person;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JsonWebToken {

    private static String jwtSecret;
    private static int jwtExpirationInMs;

    @Value("${app.jwtSecret}")
    public void setJwtSecret(String jwtSecret) {
        JsonWebToken.jwtSecret = jwtSecret;
    }

    @Value("${app.jwtExpirationInMs}")
    public void setJwtExpirationInMs(int jwtExpirationInMs) {
        JsonWebToken.jwtExpirationInMs = jwtExpirationInMs;
    }

    public static String generateJWTToken(Person person) {
        long timestamp = System.currentTimeMillis();
        return Jwts.builder().signWith(SignatureAlgorithm.HS256, jwtSecret)
                .setIssuedAt(new Date(timestamp))
                .setExpiration(new Date(timestamp + jwtExpirationInMs))
                .claim("id", person.getId())
                .compact();
    }
}
