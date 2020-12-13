import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { getUserId } from 'utilities/localStorage';
import { getProduct, getRelatedProducts } from 'api/product';
import { bidForProduct, getBidsForProduct } from 'api/bid';
import { wishlistProduct, removeWishlistProduct } from 'api/wishlist';
import { getUserInfo } from 'api/auth';
import { productUrl } from 'utilities/appUrls';
import { scrollToTop } from 'utilities/common';
import ImageCard from 'components/ImageCard';
import BidTable from 'components/Tables/BidTable';
import ProductPhotos from 'components/ProductPhotos';
import ProductInfo from 'components/ProductInfo';
import { useAlertContext, useBreadcrumbContext } from 'AppContext';
import moment from 'moment';

import './itemPage.css';

const ItemPage = ({ match, location }) => {
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
    const [seller, setSeller] = useState(null);

    const withMessage = location.state != null && location.state.withMessage;

    useEffect(() => {
        formBreadcrumb();
        scrollToTop(true);
        const fetchData = async () => {
            const productId = match.params.id;
            try {
                const data = await getProduct(productId, personId);
                setActive(moment().isBetween(moment.utc(data.startDate), moment.utc(data.endDate), null, "[)"));
                const isOwnProduct = data.personId === personId;
                setOwnProduct(isOwnProduct);
                setProduct(data);
                if (personId === null) {
                    setRelatedProducts(await getRelatedProducts(productId));
                } else {
                    setSeller(await getUserInfo(data.personId));
                }
                const bids = await getBidsForProduct(productId);
                const highestBidFromUser = Math.max(...bids.map(bid => bid.personId === personId ? bid.price : 0), 0);
                const minPrice = highestBidFromUser === 0 ? data.startPrice : highestBidFromUser + 0.01;
                setMinPrice(Math.round((minPrice + Number.EPSILON) * 100) / 100);
                setWished(data.wished);
                setBids(bids);
                if (isOwnProduct)
                    showMessage("info", "You have added this product!");
                if (location.state !== undefined && location.state.newProduct)
                    showMessage("success", "You have successfully added a new product!");
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
            const minPrice = Math.max(...newBids.map(bid => bid.personId === personId ? bid.price : 0), 0) + 0.01;
            setMinPrice(Math.round((minPrice + Number.EPSILON) * 100) / 100);
            if (personId === newBids[0].personId)
                showMessage("success", "Congratulations! You are the highest bidder!");
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
                await removeWishlistProduct(product.id);
                showMessage("success", "You have removed the product from your wishlist.");
            }
            else {
                await wishlistProduct(product.id);
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
                        seller={seller}
                        withMessage={withMessage}
                    />
                </div>
            ) : null}
            {personId !== null && bids.length !== 0 ? (
                <BidTable bids={bids} setBids={setBids} />
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
