import React, { useState } from 'react';
import { Alert, Button, Form, Image, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { RiHeartFill } from "react-icons/ri";
import { IoIosArrowForward } from "react-icons/io";
import { GoStar } from 'react-icons/go';
import { getDurationBetweenDates, longDateTimeFormat } from 'utilities/date';
import moment from 'moment';

import './productInfo.css';

const ProductInfo = ({ product, bid, wishlist, bids, minPrice, ownProduct, active, wished, seller, withMessage }) => {

    const [loading, setLoading] = useState(false);
    const [loadingWish, setLoadingWish] = useState(false);
    const [bidPrice, setBidPrice] = useState("");
    const [alertVisible, setAlertVisible] = useState(true);
    const maxPrice = 999999.99;

    const renderTooltip = () => {
        let tooltipText = "";
        switch (true) {
            case ownProduct:
                tooltipText = "You can't bid on your own product";
                break;
            case moment().isSameOrAfter(moment.utc(product.endDate)):
                tooltipText = "Auction has ended for this product"
                break;
            case !active:
                tooltipText = "Auction is yet to start for this product";
                break;
            case minPrice === maxPrice + 0.01:
                tooltipText = "Price can't be higher than $" + maxPrice;
                break;
            case bidPrice === "":
                return <div />;
            case isNaN(bidPrice):
                tooltipText = "Entered value isn't a valid number";
                break;
            case bidPrice < minPrice:
                tooltipText = "Price can't be lower than $" + minPrice;
                break;
            case bidPrice > maxPrice:
                tooltipText = "Price can't be higher than $" + maxPrice;
                break;
            default:
                return <div />;
        }

        return (
            <Tooltip>
                {tooltipText}
            </Tooltip>
        );
    }

    const getTimeInfo = () => {
        const productStartDate = moment.utc(product.startDate);
        const productEndDate = moment.utc(product.endDate);
        if (moment().isBefore(productStartDate))
            return (
                <>
                    Time start: {productStartDate.local().format(longDateTimeFormat)}
                    <br />
                    Time end: {productEndDate.local().format(longDateTimeFormat)}
                </>
            );
        const timeLeft = !active ? "0s" : getDurationBetweenDates(moment(), productEndDate);
        return (
            <>
                Time left: {timeLeft}
            </>
        );
    }

    const handleBid = async () => {
        setLoading(true);
        await bid(bidPrice);
        setBidPrice("");
        setLoading(false);
    }

    const handleWishlist = async () => {
        setLoadingWish(true);
        await wishlist();
        setLoadingWish(false);
    }

    const handleBidPrice = (price) => {
        if (isNaN(price))
            setBidPrice(price);
        setBidPrice(price.replace(/(\.\d{2})\d+/, '$1'));
    }

    return (
        <div className="product-info-container">
            <div>
                <h1>
                    {product.name}
                </h1>
                <div style={{ marginTop: 10 }} className="featured-product-price">
                    Start from ${product.startPrice}
                </div>
                {seller !== null ?
                    <div style={{ marginTop: 10, maxWidth: 500, minWidth: 220 }}>
                        {withMessage === true ?
                            <Alert className="congrats-alert" dismissible onClose={() => setAlertVisible(false)} transition={false} show={alertVisible} variant="info">
                                Congratulations!
                                <span style={{ fontWeight: 'normal' }}>
                                    {' '}You outbid the competition.
                                </span>
                            </Alert> : null}
                        <div style={{ marginTop: 15, display: 'flex', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>
                                Seller:
                            </span>
                            <Image style={{ marginLeft: 5 }} className="avatar-image-small-2" src={seller.photo} roundedCircle />
                            {seller.name}
                            <GoStar style={{ marginLeft: 20, color: 'var(--primary)', fontSize: 22, marginRight: 5 }} />
                            {seller.rating !== 0 ? (Math.round((seller.rating + Number.EPSILON) * 100) / 100 + "/5") : "No ratings"}
                        </div>
                    </div> : null}
            </div>
            <div className="place-bid-container">
                <div style={{ marginTop: 10 }}>
                    <Form.Control
                        value={bidPrice}
                        disabled={ownProduct || !active || loading || minPrice === maxPrice + 0.01}
                        maxLength="9"
                        className="form-control-gray place-bid-form"
                        size="xl-18"
                        type="text"
                        onChange={e => handleBidPrice(e.target.value)}
                        onKeyUp={e => e.key === 'Enter' ? handleBid() : null}
                    />
                    <div className="place-bid-label">
                        {minPrice !== maxPrice + 0.01 ?
                            "Enter $" + minPrice + " or more" :
                            "You entered the highest possible bid"
                        }
                    </div>
                </div>
                <OverlayTrigger
                    placement="right"
                    popperConfig={{ modifiers: [{ name: "flip", enabled: true, options: { fallbackPlacements: ["bottom", "top"] } },], }}
                    overlay={renderTooltip()}
                >
                    <div style={{ display: 'inline-block' }}>
                        <Button
                            disabled={ownProduct || !active || loading || isNaN(bidPrice) || bidPrice < minPrice || bidPrice > maxPrice}
                            style={{ width: 192, padding: 0, marginTop: 10 }}
                            size="xxl"
                            variant="transparent-black-shadow"
                            onClick={handleBid}
                        >
                            PLACE BID
                            <IoIosArrowForward style={{ fontSize: 24 }} />
                        </Button>
                    </div>
                </OverlayTrigger>
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>
                Highest bid: {' '}
                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
                    ${bids[0] === undefined ? 0 : bids[0].price}
                </span>
                <br />
                No. bids: {bids.length}
                <br />
                {getTimeInfo()}
            </div>
            <div>
                <Button
                    className="wishlist-button"
                    style={wished ? { borderColor: 'var(--primary)' } : null}
                    variant="transparent-gray"
                    onClick={handleWishlist}
                    disabled={loadingWish}
                >
                    Wishlist
                    {wished ? (
                        <RiHeartFill style={{ fontSize: 22, marginLeft: 5, color: 'var(--primary)' }} />
                    ) : (
                            <RiHeartFill style={{ fontSize: 22, marginLeft: 5, color: 'var(--lighter-silver)' }} />
                        )}
                </Button>
                <div className="font-18" style={{ marginTop: 15, maxWidth: '100%', wordWrap: 'break-word' }}>
                    Details
                    <div className="gray-line" />
                    <div className="font-15">
                        {product.description}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductInfo;
