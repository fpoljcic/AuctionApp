import React, { useEffect, useState } from 'react';
import { Button, Image } from 'react-bootstrap';
import { RiAuctionFill, RiHeartFill } from "react-icons/ri";
import { useHistory } from 'react-router-dom';
import { removeWishlistProduct, wishlistProduct } from 'api/wishlist';
import { loginUrl } from 'utilities/appUrls';
import { getUserId } from 'utilities/localStorage';

import './listCard.css';

const ListCard = ({ data, url }) => {
    const history = useHistory();
    const personId = getUserId();

    const [loadingWish, setLoadingWish] = useState(false);
    const [wished, setWished] = useState(data.wished);

    const imagePath = data.url !== null ? data.url : "/images/placeholder-image-gray.png";

    const wishlist = async () => {
        setLoadingWish(true);
        if (personId === null) {
            history.push(loginUrl);
            return;
        }
        try {
            if (wished)
                await removeWishlistProduct(personId, data.id);
            else
                await wishlistProduct(personId, data.id);
            setWished(!wished);
        } catch (e) { }
        setLoadingWish(false);
    }

    useEffect(() => {
        setWished(data.wished);
    }, [data])

    return (
        <div className="list-item-container">
            <Image
                className={"list-item-image"}
                src={imagePath}
                onClick={() => history.push(url)}
            />
            <div className="list-info-container">
                <h3>
                    {data.name}
                </h3>
                <div style={{ color: 'var(--text-secondary)' }}>
                    {data.description}
                </div>
                <div className="featured-product-price">
                    Start from ${data.startPrice}
                </div>
                <div style={{ display: 'flex' }}>
                    <Button
                        className="wishlist-button"
                        style={wished ? { borderColor: 'var(--primary)' } : null}
                        variant="transparent-gray"
                        onClick={wishlist}
                        disabled={loadingWish}
                    >
                        Wishlist
                        {wished ? (
                            <RiHeartFill style={{ fontSize: 22, marginLeft: 5, color: 'var(--primary)' }} />
                        ) : (
                                <RiHeartFill style={{ fontSize: 22, marginLeft: 5, color: 'var(--lighter-silver)' }} />
                            )}
                    </Button>
                    <Button
                        className="bid-button"
                        style={{ marginLeft: 10 }}
                        variant="transparent-gray"
                        onClick={() => history.push(url)}
                    >
                        Bid
                        <RiAuctionFill style={{ fontSize: 22, marginLeft: 5, color: 'var(--lighter-silver)' }} />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default ListCard;
