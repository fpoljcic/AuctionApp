package ba.atlantbh.auctionapp.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class FacebookService {

    private final String baseUrl = "https://graph.facebook.com";

    public boolean validToken(String id, String token) {
        final String uri = baseUrl + "/me?access_token=" + token;

        RestTemplate restTemplate = new RestTemplate();
        try {
            String result = restTemplate.getForObject(uri, String.class);
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(result);
            if (rootNode.get("id").asText().equals(id))
                return true;
        } catch (Exception ignore) {
        }

        return false;
    }

    public String getProfilePicUrl(String id, String token) {
        final String uri = baseUrl + "/" + id + "?fields=picture.height(300)&access_token=" + token;

        RestTemplate restTemplate = new RestTemplate();
        try {
            String result = restTemplate.getForObject(uri, String.class);
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readTree(result).get("picture").get("data").get("url").asText();
        } catch (Exception ignore) {
        }

        return null;
    }
}
