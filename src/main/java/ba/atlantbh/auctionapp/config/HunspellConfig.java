package ba.atlantbh.auctionapp.config;

import ba.atlantbh.auctionapp.services.ProductService;
import com.atlascopco.hunspell.Hunspell;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.File;
import java.net.URISyntaxException;

@Configuration
public class HunspellConfig {

    @Bean
    public Hunspell speller() throws URISyntaxException {
        String dicPath = new File(ProductService.class.getResource("/dictionary/en_US.dic").toURI()).getAbsolutePath();
        String affPath = new File(ProductService.class.getResource("/dictionary/en_US.aff").toURI()).getAbsolutePath();
        return new Hunspell(dicPath, affPath);
    }
}
