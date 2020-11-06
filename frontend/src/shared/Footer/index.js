import React from 'react';
import { Link } from 'react-router-dom';
import { SiFacebook, SiTwitter, SiInstagram } from "react-icons/si";
import { IoIosArrowForward } from "react-icons/io";
import { Button, Form } from 'react-bootstrap';
import { aboutUrl, privacyUrl, termsUrl } from 'utilities/appUrls';

import './footer.css';

const Footer = () => {
  return (
    <div className="footer-container">

      <div className="footer-content">
        <div className="footer-content-title">
          AUCTION
        </div>
        <Link className="silver-nav-link" to={aboutUrl}>
          About Us
        </Link>
        <Link className="silver-nav-link" to={termsUrl}>
          Terms and Conditions
        </Link>
        <Link className="silver-nav-link" to={privacyUrl}>
          Privacy and Policy
        </Link>
      </div>

      <div className="footer-content">
        <div className="footer-content-title">
          GET IN TOUCH
        </div>
        <a className="silver-nav-link" href="tel:+387 62-345-678">Call Us at +387 62-345-678</a>
        <a className="silver-nav-link" target="_blank" rel="noopener noreferrer" href="mailto:support@auction.com">support@auction.com</a>
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
      </div>

      <div className="footer-content">
        <div className="footer-content-title">
          NEWSLETTER
        </div>
        <p>
          Enter your email address and get notified
          <br />
          about new products. We hate spam!
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          <Form.Control className="footer-email-input" size="xl-16" type="text" placeholder="Your Email address" />
          <Button style={{ width: 116 }} size="xl" variant="transparent-white">
            GO
            <IoIosArrowForward style={{ fontSize: 24 }} />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Footer;
