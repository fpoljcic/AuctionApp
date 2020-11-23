package ba.atlantbh.auctionapp.responses;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Objects;
import java.util.Set;
import java.util.UUID;

@Data
@AllArgsConstructor
public class SubcategoriesResponse {
    private UUID id;
    private String name;
    private Set<SubcategoryResponse> subcategories;

    public void addSubcategory(SubcategoryResponse subcategory) {
        subcategories.add(subcategory);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SubcategoriesResponse that = (SubcategoriesResponse) o;
        return Objects.equals(name, that.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name);
    }

    public SubcategoriesResponse(String name) {
        this.name = name;
    }
}
