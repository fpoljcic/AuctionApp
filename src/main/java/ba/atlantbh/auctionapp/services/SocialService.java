package ba.atlantbh.auctionapp.services;

import ba.atlantbh.auctionapp.models.enums.Social;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class SocialService {

    private final FacebookService facebookService;
    private final GoogleService googleService;

    public boolean validToken(Social type, String id, String token) {
        switch (type) {
            case Facebook:
                return facebookService.validToken(id, token);
            case Google:
                return googleService.validToken(id, token);
        }
        return false;
    }

    public String getProfilePicUrl(Social type, String id, String token) {
        switch (type) {
            case Facebook:
                return facebookService.getProfilePicUrl(id, token);
            case Google:
                return googleService.getProfilePicUrl(id);
        }
        return null;
    }
}
