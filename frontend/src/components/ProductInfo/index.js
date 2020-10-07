import React, { useState } from 'react';
import { Button, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { RiHeartFill } from "react-icons/ri";
import { IoIosArrowForward } from "react-icons/io";
import moment from 'moment';

import './productInfo.css';

const ProductInfo = ({ product, bid, wishlist, bids, minPrice, ownProduct, active, wished }) => {

    const [loading, setLoading] = useState(false);
    const [loadingWish, setLoadingWish] = useState(false);
    const [bidPrice, setBidPrice] = useState("");

    const renderTooltip = () => {
        let tooltipText = "";
        switch (true) {
            case ownProduct:
                tooltipText = "You can't bid on your own product";
                break;
            case !active:
                tooltipText = "Auction is yet to start for this product";
                break;
            case bidPrice === "":
                return <div />;
            case isNaN(bidPrice):
                tooltipText = "Entered value isn't a valid number";
                break;
            case bidPrice < minPrice:
                tooltipText = "Price can't be lower than $" + minPrice;
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
        const productStartDate = moment(product.startDate);
        if (moment().isBefore(productStartDate))
            return (
                <>
                    Time start: {productStartDate.format("D MMMM YYYY [at] HH:mm")}
                    <br />
                    Time end: {moment(product.endDate).format("D MMMM YYYY [at] HH:mm")}
                </>
            );
        const timeLeft = !active ? 0 : moment.duration(moment(product.endDate).diff(moment())).format("D [days] h [hours] m [minutes]");
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

    return (
        <div className="product-info-container">
            <div>
                <h1>
                    {product.name}
                </h1>
                <div style={{ marginTop: 10 }} className="featured-product-price">
                    Start from ${product.startPrice}
                </div>
            </div>
            <div className="place-bid-container">
                <div>
                    <Form.Control
                        value={bidPrice}
                        disabled={ownProduct || !active || loading}
                        maxLength="7"
                        className="form-control-gray place-bid-form"
                        size="xl-18"
                        type="text"
                        onChange={e => setBidPrice(e.target.value)}
                    />
                    <div className="place-bid-label">
                        Enter ${minPrice} or more
                    </div>
                </div>
                <OverlayTrigger
                    placement="right"
                    overlay={renderTooltip()}
                >
                    <Button
                        disabled={ownProduct || !active || loading || isNaN(bidPrice) || bidPrice < minPrice}
                        style={{ width: 192, padding: 0 }}
                        size="xxl"
                        variant="transparent-black-shadow"
                        onClick={handleBid}
                    >
                        PLACE BID
                        <IoIosArrowForward style={{ fontSize: 24 }} />
                    </Button>
                </OverlayTrigger>
            </div>
            <div style={{ color: '#9B9B9B' }}>
                Highest bid: {' '}
                <span style={{ color: '#8367D8', fontWeight: 'bold' }}>
                    ${bids[0] === undefined ? 0 : bids[0].price}
                </span>
                <br />
                No bids: {bids.length}
                <br />
                {getTimeInfo()}
            </div>
            <div>
                <Button
                    className="wishlist-button"
                    style={wished ? { borderColor: '#8367D8' } : null}
                    variant="transparent-gray"
                    onClick={handleWishlist}
                    disabled={loadingWish}
                >
                    Wishlist
                    {wished ? (
                        <RiHeartFill style={{ fontSize: 22, marginLeft: 5, color: '#8367D8' }} />
                    ) : (
                            <RiHeartFill style={{ fontSize: 22, marginLeft: 5, color: '#ECECEC' }} />
                        )}
                </Button>
                <div className="font-18" style={{ marginTop: 15 }}>
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
