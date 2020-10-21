import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { productUrl, shopUrl } from 'utilities/appUrls';
import { BsGrid3X3GapFill } from "react-icons/bs";
import { FaThList } from "react-icons/fa";
import { searchProducts } from 'api/product';
import { Button, Form, Spinner } from 'react-bootstrap';
import { removeSpaces } from 'utilities/appUrls';
import { capitalizeFirstLetter } from 'utilities/common';
import CategoriesFilter from 'components/CategoriesFilter';
import ItemNotFound from 'components/ItemNotFound';
import ListCard from 'components/ListCard';
import ImageCard from 'components/ImageCard';
import ImageCardOverlay from 'components/ImageCardOverlay';
import { useAlertContext, useBreadcrumbContext } from 'AppContext';
import * as qs from 'query-string';

import './shop.css';

var page = 0;
var queryChanged = true;

const Shop = () => {
    const { setBreadcrumb } = useBreadcrumbContext();
    const { showMessage } = useAlertContext();

    const [products, setProducts] = useState([]);
    const [filter, setFilter] = useState({ category: null, subcategory: null });
    const [gridLayout, setGridLayout] = useState(true);
    const [lastPage, setLastPage] = useState(true);
    const [loading, setLoading] = useState(true);

    const history = useHistory();
    const urlParams = qs.parse(history.location.search);

    useEffect(() => {
        setLoading(true);
        formBreadcrumb();
        // eslint-disable-next-line
    }, [history.location.pathname, history.location.search])

    useEffect(() => {
        queryChanged = true;
    }, [urlParams.query])

    const formCategoryName = (name) => {
        if (name === undefined)
            return null;
        name = name.split("_").join(" ");
        return capitalizeFirstLetter(name);
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
        try {
            const data = await searchProducts(urlParams.query, newFilter.category, newFilter.subcategory, page, urlParams.sort);
            setProducts(data.products);
            setLastPage(data.lastPage);
            if (queryChanged && urlParams.query !== undefined && data.didYouMean !== "" && urlParams.query !== data.didYouMean) {
                showMessage("warning", (
                    <>
                        Did you mean?
                        <span
                            className="font-18"
                            style={{ marginLeft: 20, color: 'var(--primary)', cursor: 'pointer' }}
                            onClick={() => history.push({
                                search: qs.stringify({ ...urlParams, query: data.didYouMean })
                            })}
                        >
                            {capitalizeFirstLetter(data.didYouMean)}
                        </span>
                    </>
                ));
                queryChanged = false;
            }
        } catch (e) { }
        setLoading(false);
    }

    const exploreMore = async () => {
        setLoading(true);
        page++;
        try {
            const data = await searchProducts(urlParams.query, filter.category, filter.subcategory, page, urlParams.sort);
            setProducts([...products, ...data.products]);
            setLastPage(data.lastPage);
        } catch (e) {
            page--;
        }
        setLoading(false);
    }

    const sortBy = async (sort) => {
        page = 0;
        urlParams.sort = sort;
        history.push({
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
                    <Form.Control className="sort-select" defaultValue={urlParams.sort} onChange={e => sortBy(e.target.value)} size="lg" as="select" >
                        <option value="default">Default Sorting</option>
                        <option value="popularity">Sort by Popularity</option>
                        <option value="new">Sort by New</option>
                        <option value="price">Sort by Price</option>
                    </Form.Control>
                    {loading ? <Spinner className="shop-spinner" animation="border" /> : null}
                    <div style={{ display: 'flex' }}>
                        <Button onClick={() => setGridLayout(true)} style={gridLayout ? { color: 'var(--white)', backgroundColor: 'var(--primary)' } : null} size="lg" variant="transparent">
                            <BsGrid3X3GapFill style={{ marginRight: 10 }} />
                            Grid
                        </Button>
                        <Button onClick={() => setGridLayout(false)} style={gridLayout ? null : { color: 'var(--white)', backgroundColor: 'var(--primary)' }} size="lg" variant="transparent">
                            <FaThList style={{ marginRight: 10 }} />
                            List
                        </Button>
                    </div>
                </div>

                <div style={!gridLayout ? { display: 'unset' } : null} className="shop-products">
                    {products.map(product => gridLayout ? (
                        <ImageCardOverlay key={product.id} data={product} url={productUrl(product)}>
                            <ImageCard data={product} size="xl" url={productUrl(product)} />
                        </ImageCardOverlay>
                    ) : (
                            <ListCard key={product.id} data={product} url={productUrl(product)} />
                        ))}
                </div>


                {!loading && products.length === 0 ? <ItemNotFound /> : null}

                {!lastPage ?
                    <div style={{ width: '100%', marginTop: 50 }}>
                        <Button disabled={loading} onClick={exploreMore} style={{ width: 250, margin: '0 auto' }} variant="fill-purple" size="xxl">
                            EXPLORE MORE
                        </Button>
                    </div> : null}
            </div>
        </div>
    );
}

export default Shop;
