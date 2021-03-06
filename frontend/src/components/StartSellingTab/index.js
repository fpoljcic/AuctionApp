import React from 'react';
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { IoIosArrowForward } from 'react-icons/io';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import { myAccountSellerSellUrl } from 'utilities/appUrls';

import './startSellingTab.css';

const StartSellingTab = () => {
    const history = useHistory();

    return (
        <div className="start-sell-container">
            <div className="sell-container">
                <div className="sell-cart-container font-18">
                    <HiOutlineShoppingBag style={{ fontSize: 200, color: 'var(--primary)' }} />
                    You do not have any scheduled items for sale.
                </div>
                <Button
                    style={{ width: 303 }}
                    size="xxl"
                    variant="transparent-black-shadow"
                    onClick={() => history.push(myAccountSellerSellUrl)}
                >
                    START SELLING
                    <IoIosArrowForward style={{ fontSize: 24, marginRight: -5, marginLeft: 5 }} />
                </Button>
            </div>
        </div>
    );
}

export default StartSellingTab;
