package ba.atlantbh.auctionapp.responses;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Objects;
import java.util.Set;

@Data
@AllArgsConstructor
public class CategoryCountReponse implements Comparable<CategoryCountReponse> {
    private String name;
    private Integer count;
    private Set<CountResponse> subcategories;

    @Override
    public int compareTo(CategoryCountReponse o) {
        return o.count.compareTo(this.count);
    }

    public void addSubcategory(CountResponse countResponse) {
        subcategories.add(countResponse);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CategoryCountReponse that = (CategoryCountReponse) o;
        return name.equals(that.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name);
    }
}
