import React, { useEffect, useState } from 'react';
import { SiFacebook, SiTwitter, SiInstagram } from "react-icons/si";
import { RiAuctionFill } from "react-icons/ri";
import { GrFormSearch } from "react-icons/gr";
import { FormControl, Image, ListGroup, Nav, Navbar } from 'react-bootstrap';
import { Link, NavLink, useHistory } from 'react-router-dom';
import { removeSession, getUser } from 'utilities/localStorage';
import { homeUrl, loginUrl, myAccountUrl, registerUrl, shopUrl, myAccountSellerUrl, myAccountBidsUrl, myAccountWishlistUrl, myAccountSettingsUrl, forgotPasswordUrl, resetPasswordUrl, aboutUrl, termsUrl, privacyUrl } from 'utilities/appUrls';
import NotificationBell from 'shared/NotificationBell';
import { useUserContext } from 'AppContext';
import * as qs from 'query-string';

import './header.css';

const Header = () => {
    const { loggedIn, setLoggedIn } = useUserContext();

    const user = getUser();
    const history = useHistory();

    const [searchInput, setSearchInput] = useState("");
    const [accountListVisible, setAccountListVisible] = useState(false);

    const handleLogout = () => {
        setLoggedIn(false);
        removeSession();
    };

    useEffect(() => {
        const urlParams = qs.parse(history.location.search);
        if (searchInput !== urlParams.query)
            setSearchInput(urlParams.query);
        // eslint-disable-next-line
    }, [history.location.search])

    const handleSearch = async () => {
        const urlParams = {
            query: searchInput,
            sort: "default"
        };
        history.push({
            pathname: shopUrl,
            search: qs.stringify(urlParams)
        });
    }

    return (
        <>
            <div className="top-header-container">
                <div className="socials-container">
                    <a className="social-link" rel="noopener noreferrer" href="https://www.facebook.com/AtlantBH" target="_blank">
                        <SiFacebook />
                    </a>
                    <a className="social-link" rel="noopener noreferrer" href="https://twitter.com/atlantbh" target="_blank">
                        <SiTwitter />
                    </a>
                    <a className="social-link" rel="noopener noreferrer" href="https://www.instagram.com/atlantbh" target="_blank">
                        <SiInstagram />
                    </a>
                </div>
                <Nav className="top-header-nav-links">
                    {loggedIn ?
                        (
                            <>
                                <Image style={{ marginRight: '0.5rem' }} roundedCircle className="avatar-image-tiny" src={user.photo} />
                                <div className="top-header-username">
                                    {user.firstName + ' ' + user.lastName}
                                </div>
                                |
                                <Link style={{ paddingRight: 0, paddingLeft: 5 }} className="white-nav-link nav-link" onClick={handleLogout} to={homeUrl}>
                                    Log out
                                </Link>
                            </>
                        ) :
                        (
                            <>
                                <Link className="white-nav-link nav-link" to={loginUrl}>
                                    Login
                                </Link>
                                <Navbar.Text style={{ color: 'var(--text-secondary)' }}>
                                    or
                                </Navbar.Text>
                                <Link style={{ paddingRight: 0 }} className="white-nav-link nav-link" to={registerUrl}>
                                    Create an Account
                                </Link>
                            </>
                        )}
                </Nav>
            </div>

            <div className="bottom-header-container">
                <Link className="bottom-header-brand" to={homeUrl}>
                    <RiAuctionFill style={{ color: 'var(--pale-purple)', marginRight: 5 }} />
                    AUCTION
                </Link>
                <div className="bottom-header-search">
                    <FormControl
                        value={searchInput || ""}
                        onChange={(e) => setSearchInput(e.target.value)}
                        size="xl-18"
                        type="text"
                        maxLength="255"
                        placeholder="Try enter: Shoes"
                        onKeyUp={(e) => e.key === 'Enter' ? handleSearch() : null}
                    />
                    <GrFormSearch className="bottom-header-search-icon" onClick={handleSearch} />
                </div>
                <Nav style={{ position: 'relative' }}>
                    <NavLink
                        isActive={(match, location) => (match.isExact || location.pathname === loginUrl || location.pathname === registerUrl ||
                            location.pathname === forgotPasswordUrl || location.pathname === resetPasswordUrl)}
                        className="black-nav-link nav-link"
                        activeClassName="black-active-nav-link"
                        to={homeUrl}
                    >
                        HOME
                    </NavLink>
                    <NavLink
                        isActive={(match, location) => ((match !== null && match.url === shopUrl) || location.pathname === aboutUrl || location.pathname === termsUrl ||
                            location.pathname === privacyUrl)}
                        className="black-nav-link nav-link"
                        activeClassName="black-active-nav-link"
                        to={shopUrl}
                    >
                        SHOP
                    </NavLink>
                    <NavLink
                        style={{ paddingTop: 28, paddingBottom: 28, paddingRight: loggedIn ? '1rem' : 0 }}
                        className={"black-nav-link nav-link"}
                        activeClassName="black-active-nav-link"
                        to={myAccountUrl}
                        onMouseEnter={() => setAccountListVisible(true)}
                        onMouseLeave={() => setAccountListVisible(false)}
                    >
                        MY ACCOUNT
                    </NavLink>
                    {accountListVisible ?
                        <ListGroup
                            className="account-list"
                            variant="filter"
                            onMouseEnter={() => setAccountListVisible(true)}
                            onMouseLeave={() => setAccountListVisible(false)}
                        >
                            <ListGroup.Item onClick={() => history.push(myAccountUrl)}>Profile</ListGroup.Item>
                            <ListGroup.Item onClick={() => history.push(myAccountSellerUrl)}>Your Products</ListGroup.Item>
                            <ListGroup.Item onClick={() => history.push(myAccountBidsUrl)}>Your Bids</ListGroup.Item>
                            <ListGroup.Item onClick={() => history.push(myAccountWishlistUrl)}>Wishlist</ListGroup.Item>
                            <ListGroup.Item onClick={() => history.push(myAccountSettingsUrl)}>Settings</ListGroup.Item>
                        </ListGroup> : null}
                    {loggedIn ? <NotificationBell /> : null}
                </Nav>
            </div>
        </>
    );
}

export default Header;
