import ImageCard from 'components/ImageCard';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { productUrl, shopUrl } from 'utilities/appUrls';
import { BsGrid3X3GapFill } from "react-icons/bs";
import { FaThList } from "react-icons/fa";
import { searchProducts } from 'api/product';
import { Button, Form } from 'react-bootstrap';
import { removeSpaces } from 'utilities/appUrls';
import CategoriesFilter from 'components/CategoriesFilter';
import ItemNotFound from 'components/ItemNotFound';
import * as qs from 'query-string';

import './shop.css';

var page = 0;

const Shop = ({ setBreadcrumb }) => {

    const [products, setProducts] = useState([]);
    const [filter, setFilter] = useState({ category: null, subcategory: null });
    const [gridLayout, setGridLayout] = useState(true);
    const [lastPage, setLastPage] = useState(true);

    const history = useHistory();
    const urlParams = qs.parse(history.location.search);

    useEffect(() => {
        formBreadcrumb();
        // eslint-disable-next-line
    }, [history.location.pathname, history.location.search])

    const formCategoryName = (name) => {
        if (name === undefined)
            return null;
        name = name.split("_").join(" ");
        return name.charAt(0).toUpperCase() + name.slice(1);
    }

    const formBreadcrumb = () => {
        const urlElements = history.location.pathname.split("/").slice(1);
        if (urlElements.length === 1) {
            setBreadcrumb("SHOP", []);
        } else {
            setBreadcrumb("SHOP", urlElements.map((el, i) => {
                return {
                    text: el.toUpperCase().split("_").join(" "),
                    href: qs.stringifyUrl({ url: "/" + urlElements.slice(0, i + 1).join("/"), query: urlParams })
                }
            }));
        }
        refreshData(urlElements);
    }

    const refreshData = async (urlElements) => {
        page = 0;
        const newFilter = { category: formCategoryName(urlElements[1]), subcategory: formCategoryName(urlElements[2]) };
        setFilter(newFilter);
        const data = await searchProducts(urlParams.query, newFilter.category, newFilter.subcategory, page, urlParams.sort);
        setProducts(data.products);
        setLastPage(data.lastPage);
    }

    const exploreMore = async () => {
        page++;
        const data = await searchProducts(urlParams.query, filter.category, filter.subcategory, page, urlParams.sort);
        setProducts([...products, ...data.products]);
        setLastPage(data.lastPage);
    }

    const sortBy = async (sort) => {
        page = 0;
        urlParams.sort = sort;
        history.push({
            pathname: shopUrl,
            search: qs.stringify(urlParams)
        });
    }

    const handleClick = (selected) => {
        let categoryPath = "";
        let subcategoryPath = "";
        if (selected.category !== null)
            categoryPath = "/" + removeSpaces(selected.category);
        if (selected.subcategory !== null)
            subcategoryPath = "/" + removeSpaces(selected.subcategory);
        history.push({
            pathname: shopUrl + categoryPath + subcategoryPath,
            search: qs.stringify(urlParams)
        });
    }

    return (
        <div className="shop-container">
            <div className="shop-filters-container">
                <CategoriesFilter filter={filter} handleClick={handleClick} query={urlParams.query} />
            </div>

            <div className="shop-products-container">
                <div className="shop-sorting-bar">
                    <Form.Control defaultValue={urlParams.sort} onChange={e => sortBy(e.target.value)} size="lg" as="select" style={{ width: '30%' }}>
                        <option value="default">Default Sorting</option>
                        <option value="popularity">Sort by Popularity</option>
                        <option value="new">Sort by New</option>
                        <option value="price">Sort by Price</option>
                    </Form.Control>
                    <div style={{ display: 'flex' }}>
                        <Button onClick={() => setGridLayout(true)} style={gridLayout ? { color: 'white', backgroundColor: '#8367D8' } : null} size="lg" variant="transparent">
                            <BsGrid3X3GapFill style={{ marginRight: 10 }} />
                            Grid
                        </Button>
                        <Button onClick={() => setGridLayout(false)} style={gridLayout ? null : { color: 'white', backgroundColor: '#8367D8' }} size="lg" variant="transparent">
                            <FaThList style={{ marginRight: 10 }} />
                            List
                        </Button>
                    </div>
                </div>

                <div className="shop-products">
                    {products.map(product => (
                        <ImageCard key={product.id} data={product} size="xl" url={productUrl(product)} />
                    ))}
                </div>

                {products.length === 0 ? <ItemNotFound /> : null}

                {!lastPage ?
                    <div style={{ width: '100%', marginTop: 50 }}>
                        <Button onClick={exploreMore} style={{ width: 250, margin: '0 auto' }} variant="fill-purple" size="xxl">
                            EXPLORE MORE
                        </Button>
                    </div> : null}
            </div>
        </div>
    );
}

export default Shop;
