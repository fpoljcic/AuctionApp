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
    private static int jwtExpiration;

    @Value("${app.jwtSecret}")
    public void setJwtSecret(String jwtSecret) {
        JsonWebToken.jwtSecret = jwtSecret;
    }

    @Value("${app.jwtExpiration}")
    public static void setJwtExpiration(int jwtExpiration) {
        JsonWebToken.jwtExpiration = jwtExpiration;
    }

    public static String generateJWTToken(Person person) {
        long timestamp = System.currentTimeMillis();
        return Jwts.builder().signWith(SignatureAlgorithm.HS256, jwtSecret)
                .setIssuedAt(new Date(timestamp))
                .setExpiration(new Date(timestamp + jwtExpiration))
                .claim("id", person.getId())
                .compact();
    }
}

