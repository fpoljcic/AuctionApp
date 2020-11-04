package ba.atlantbh.auctionapp.utilities;

import ba.atlantbh.auctionapp.models.Card;
import ba.atlantbh.auctionapp.models.Person;
import ba.atlantbh.auctionapp.requests.CardRequest;
import ba.atlantbh.auctionapp.requests.UpdateProfileRequest;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface UpdateMapper {

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updatePerson(UpdateProfileRequest updateProfileRequest, @MappingTarget Person person);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateCard(CardRequest cardRequest, @MappingTarget Card card);
}
