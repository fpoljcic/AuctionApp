import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useBreadcrumbContext } from 'AppContext';
import { Button } from 'react-bootstrap';
import { myAccountBidsUrl, myAccountSellerUrl, myAccountSettingsUrl, myAccountUrl, myAccountWishlistUrl } from 'utilities/appUrls';
import Profile from 'components/MyAccountTabs/Profile';
import Seller from 'components/MyAccountTabs/Seller';
import Bids from 'components/MyAccountTabs/Bids';
import Wishlist from 'components/MyAccountTabs/Wishlist';
import Settings from 'components/MyAccountTabs/Settings';
import PageNotFound from 'pages/PageNotFound';
import { FaGift, FaList, FaUser } from 'react-icons/fa';
import { ImHammer2 } from 'react-icons/im';
import { RiSettings5Fill } from 'react-icons/ri';

import './myAccount.css';

const MyAccount = () => {
    const { setBreadcrumb } = useBreadcrumbContext();
    const history = useHistory();

    const [activeTab, setActiveTab] = useState(0);

    const tabs = [<Profile />, <Seller />, <Bids />, <Wishlist />, <Settings />, <PageNotFound />];

    useEffect(() => {
        formBreadcrumb();
        // eslint-disable-next-line 
    }, [history.location.pathname])

    const formBreadcrumb = () => {
        const urlElements = history.location.pathname.split("/").slice(1);
        if (urlElements.length === 1) {
            setBreadcrumb("MY ACCOUNT", []);
            setActiveTab(0);
        } else {
            setBreadcrumb("MY ACCOUNT", urlElements.map((el, i) => {
                return {
                    text: el.toUpperCase().split("_").join(" "),
                    href: "/" + urlElements.slice(0, i + 1).join("/")
                }
            }));
            switch (urlElements[1]) {
                case "seller":
                    setActiveTab(1);
                    break;
                case "bids":
                    setActiveTab(2);
                    break;
                case "wishlist":
                    setActiveTab(3);
                    break;
                case "settings":
                    setActiveTab(4);
                    break;
                default:
                    setActiveTab(5);
            }
        }
    }

    return (
        <div>
            <div className="account-tabs-container">
                <Button onClick={() => history.push(myAccountUrl)} variant={activeTab === 0 ? "fill-purple" : "fill-gray"} size="lg">
                    <FaUser style={{ marginRight: 5 }} />
                    Profile
                </Button>
                <Button onClick={() => history.push(myAccountSellerUrl)} variant={activeTab === 1 ? "fill-purple" : "fill-gray"} size="lg">
                    <FaList style={{ marginRight: 5 }} />
                    Seller
                </Button>
                <Button onClick={() => history.push(myAccountBidsUrl)} variant={activeTab === 2 ? "fill-purple" : "fill-gray"} size="lg">
                    <ImHammer2 style={{ marginRight: 5 }} />
                    Bids
                </Button>
                <Button onClick={() => history.push(myAccountWishlistUrl)} variant={activeTab === 3 ? "fill-purple" : "fill-gray"} size="lg">
                    <FaGift style={{ marginRight: 5 }} />
                    Wishlist
                </Button>
                <Button onClick={() => history.push(myAccountSettingsUrl)} variant={activeTab === 4 ? "fill-purple" : "fill-gray"} size="lg">
                    <RiSettings5Fill style={{ fontSize: 20, marginRight: 5 }} />
                    Settings
                </Button>
            </div>
            {tabs[activeTab]}
        </div>
    );
}

export default MyAccount;
