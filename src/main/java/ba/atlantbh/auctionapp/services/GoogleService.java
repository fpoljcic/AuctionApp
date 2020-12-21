package ba.atlantbh.auctionapp.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class GoogleService {

    private final String baseUrl = "https://www.googleapis.com";
    private final String basePeopleUrl = "https://people.googleapis.com";

    private String googleAppKey;

    @Value("${app.googleAppKey}")
    public void setHostUrl(String googleAppKey) {
        this.googleAppKey = googleAppKey;
    }

    public boolean validToken(String id, String token) {
        final String uri = baseUrl + "/oauth2/v1/tokeninfo?access_token=" + token;

        RestTemplate restTemplate = new RestTemplate();
        try {
            String result = restTemplate.getForObject(uri, String.class);
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(result);
            if (rootNode.get("user_id").asText().equals(id))
                return true;
        } catch (Exception ignore) {
        }

        return false;
    }

    public String getProfilePicUrl(String id) {
        final String uri = basePeopleUrl + "/v1/people/" + id + "?personFields=photos&key=" + googleAppKey;

        RestTemplate restTemplate = new RestTemplate();
        try {
            String result = restTemplate.getForObject(uri, String.class);
            ObjectMapper mapper = new ObjectMapper();
            String photoUrl = mapper.readTree(result).get("photos").get(0).get("url").asText();
            return photoUrl.replace("s100", "s300");
        } catch (Exception ignore) {
        }

        return null;
    }
}
