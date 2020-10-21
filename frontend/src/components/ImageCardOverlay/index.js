import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { RiAuctionFill, RiHeartFill } from 'react-icons/ri';
import { useHistory } from 'react-router-dom';
import { removeWishlistProduct, wishlistProduct } from 'api/wishlist';
import { loginUrl } from 'utilities/appUrls';
import { getUserId } from 'utilities/localStorage';

import './imageCardOverlay.css';

const ImageCardOverlay = ({ children, data, url }) => {
    const history = useHistory();
    const personId = getUserId();

    const [visible, setVisible] = useState(false);
    const [loadingWish, setLoadingWish] = useState(false);
    const [wished, setWished] = useState(data.wished);

    useEffect(() => {
        setWished(data.wished);
    }, [data])

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

    return (
        <div onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
            {visible ? (
                <div className="overlay-container">
                    <Button
                        className="overlay-wishlist-button font-15"
                        style={wished ? { borderColor: 'var(--primary)' } : null}
                        variant="fill-white"
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
                        className="overlay-bid-button font-15"
                        variant="fill-white"
                        onClick={() => history.push(url)}
                    >
                        Bid
                        <RiAuctionFill style={{ fontSize: 22, marginLeft: 5, color: 'var(--lighter-silver)' }} />
                    </Button>
                </div>
            ) : null}
            {children}
        </div>
    );
}

export default ImageCardOverlay;
