import React from 'react';
import { FacebookIcon, FacebookShareButton, LinkedinIcon, LinkedinShareButton, RedditIcon, RedditShareButton, TwitterIcon, TwitterShareButton } from 'react-share';

import './shareButtons.css';

const ShareButtons = ({ url, title }) => {

    return (
        <div className="share-buttons-container">
            <div className="share-text">
                Share via:
            </div>
            <FacebookShareButton url={url}>
                <FacebookIcon size={36} round={true} />
            </FacebookShareButton>
            <TwitterShareButton style={{ marginLeft: 10 }} url={url} title={title}>
                <TwitterIcon size={36} round={true} />
            </TwitterShareButton>
            <LinkedinShareButton style={{ marginLeft: 10 }} url={url} title={title}>
                <LinkedinIcon size={36} round={true} />
            </LinkedinShareButton>
            <RedditShareButton style={{ marginLeft: 10 }} url={url} title={title}>
                <RedditIcon size={36} round={true} />
            </RedditShareButton>
        </div>
    );
}

export default ShareButtons;
