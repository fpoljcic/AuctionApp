import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { getUserId } from 'utilities/localStorage';
import { getProduct, getRelatedProducts } from 'api/product';
import { bidForProduct, getBidsForProduct } from 'api/bid';
import { wishlistProduct, removeWishlistProduct } from 'api/wishlist';
import { productUrl } from 'utilities/appUrls';
import { scrollToTop } from 'utilities/common';
import ImageCard from 'components/ImageCard';
import BidTable from 'components/BidTable';
import ProductPhotos from 'components/ProductPhotos';
import ProductInfo from 'components/ProductInfo';
import { useAlertContext, useBreadcrumbContext } from 'AppContext';
import moment from 'moment';

import './itemPage.css';

const ItemPage = ({ match }) => {
    const personId = getUserId();
    const { setBreadcrumb } = useBreadcrumbContext();
    const { showMessage } = useAlertContext();

    const [product, setProduct] = useState(null);
    const [bids, setBids] = useState([]);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [active, setActive] = useState(true);
    const [ownProduct, setOwnProduct] = useState(false);
    const [wished, setWished] = useState(false);
    const [minPrice, setMinPrice] = useState(0);

    useEffect(() => {
        formBreadcrumb();
        scrollToTop();
        const fetchData = async () => {
            const productId = match.params.id;
            try {
                const data = await getProduct(productId, personId);
                setActive(moment().isBetween(moment.utc(data.startDate), moment.utc(data.endDate), null, "[)"));
                setOwnProduct(data.personId === personId);
                setProduct(data);
                if (personId === null) {
                    setRelatedProducts(await getRelatedProducts(productId));
                }
                const bids = await getBidsForProduct(productId);
                const highestBidFromUser = Math.max(...bids.map(bid => bid.personId === personId ? bid.price : 0), 0);
                setMinPrice(highestBidFromUser === 0 ? data.startPrice : highestBidFromUser + 0.01);
                setWished(data.wished);
                setBids(bids);
            } catch (e) { }
        }

        fetchData();
        // eslint-disable-next-line
    }, [match.params.id])

    const formBreadcrumb = () => {
        const urlElements = match.url.split("/").slice(1, -1);
        setBreadcrumb("SINGLE PRODUCT", [...urlElements.map((el, i) => {
            return {
                text: el.toUpperCase().split("_").join(" "),
                href: "/" + urlElements.slice(0, i + 1).join("/")
            }
        }), { text: "SINGLE PRODUCT" }]);
    }

    const bid = async (price) => {
        if (personId === null) {
            showMessage("warning", "You have to be logged in to place bids.");
            return;
        }
        try {
            await bidForProduct(parseFloat(price), product.id);
            const newBids = await getBidsForProduct(product.id);
            setMinPrice(Math.max(...newBids.map(bid => bid.personId === personId ? bid.price : 0), 0) + 0.01);
            if (personId === newBids[0].personId)
                showMessage("success", "Congratulations! You are the highest bider!");
            else
                showMessage("warning", "There are higher bids than yours. You could give a second try!");
            setBids(newBids);
        } catch (e) { }
    }

    const wishlist = async () => {
        if (personId === null) {
            showMessage("warning", "You have to be logged in to wishlist products.");
            return;
        }
        try {
            if (wished) {
                await removeWishlistProduct(personId, product.id);
                showMessage("success", "You have removed the product from your wishlist.");
            }
            else {
                await wishlistProduct(personId, product.id);
                showMessage("success", "You have added the product to your wishlist.");
            }
            setWished(!wished);
        } catch (e) { }
    }

    return (
        <>
            {product !== null ? (
                <div className="product-container">
                    <ProductPhotos photos={product.photos} />
                    <ProductInfo
                        product={product}
                        bid={bid}
                        wishlist={wishlist}
                        bids={bids}
                        minPrice={minPrice}
                        ownProduct={ownProduct}
                        active={active}
                        wished={wished}
                    />
                </div>
            ) : null}
            {personId !== null && bids.length !== 0 ? (
                <BidTable bids={bids} />
            ) : null}
            {personId === null && product !== null ? (
                <div style={{ marginTop: 150 }} className="featured-container">
                    <h2>
                        Related products
                    </h2>
                    <div className="gray-line" />
                    <div className="featured-items-container">
                        {relatedProducts.map(product => (
                            <ImageCard key={product.id} data={product} size="xxl" url={productUrl(product)} />
                        ))}
                    </div>
                </div>
            ) : null}
        </>
    );
}

export default withRouter(ItemPage);
