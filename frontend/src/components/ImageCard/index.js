import React from 'react';
import { Image } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import './imageCard.css';

const ImageCard = ({ data, size, url, fromLandingPage }) => {
    const history = useHistory();

    const imagePath = data.url !== null ? data.url : "/images/placeholder-image-gray.png";

    const handleClick = () => {
        if (fromLandingPage)
            history.push({
                pathname: url,
                state: { fromLandingPage: true }
            })
        else
            history.push(url);
    }

    return (
        <div className="featured-item-container">
            <Image
                className={"featured-item-image-" + size}
                src={imagePath}
                onClick={handleClick}
            />
            <h3 onClick={handleClick} className={"word-wrap-" + size}>
                {data.name}
            </h3>
            Start from ${data.startPrice}
        </div>
    );
}

export default ImageCard;
