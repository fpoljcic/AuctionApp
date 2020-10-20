import React from 'react';
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { homeUrl } from 'utilities/appUrls';
import { RiAuctionFill } from "react-icons/ri";

import './pageNotFound.css';

const PageNotFound = () => {

    const history = useHistory();

    const goHome = () => {
        history.push(homeUrl);
    }

    return (
        <div className="page-not-found-container">
            <div className="bottom-header-brand">
                <RiAuctionFill style={{ color: 'var(--pale-purple)', marginRight: 5 }} />
                AUCTION
            </div>
            <div className="page-not-found-404">
                404
            </div>
            <div className="page-not-found-title">
                Ooops! Looks like the page is Not Found
            </div>
            <Button onClick={goHome} style={{ width: 180 }} size="xxl" variant="transparent-black-shadow">
                GO HOME
            </Button>
        </div>
    );
}

export default PageNotFound;
