import React from 'react';
import { SiFacebook, SiTwitter, SiInstagram } from "react-icons/si";
import { RiAuctionFill } from "react-icons/ri";
import { GrFormSearch } from "react-icons/gr";
import { FormControl, Nav, Navbar } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';

import './header.css';

const Header = () => {
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
                <Nav>
                    <Link className="white-nav-link nav-link" to="/login">
                        Login
                    </Link>
                    <Navbar.Text style={{ color: '#9B9B9B' }}>
                        or
                    </Navbar.Text>
                    <Link className="white-nav-link nav-link" to="/register">
                        Create an Account
                    </Link>
                </Nav>
            </div>

            <div className="bottom-header-container">
                <Link className="bottom-header-brand" to="/">
                    <RiAuctionFill style={{ color: '#C4BFD6', marginRight: 5 }} />
                    AUCTION
                </Link>
                <div className="bottom-header-search">
                    <FormControl size="xl-18" type="text" placeholder="Try enter: Shoes" />
                    <GrFormSearch className="bottom-header-search-icon" />
                </div>
                <Nav>
                    <NavLink exact className="black-nav-link nav-link" activeClassName="black-active-nav-link" to="/">HOME</NavLink>
                    <NavLink className="black-nav-link nav-link" activeClassName="black-active-nav-link" to="/shop">SHOP</NavLink>
                    <NavLink className="black-nav-link nav-link" activeClassName="black-active-nav-link" to="/my_account">MY ACCOUNT</NavLink>
                </Nav>
            </div>
        </>
    );
}

export default Header;