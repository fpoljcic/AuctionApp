import React from 'react';
import { Image } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import './imageCard.css';

const ImageCard = ({ data, size, url }) => {
    const history = useHistory();

    const imagePath = data.url !== null ? data.url : "/images/placeholder-image-gray.png";

    return (
        <div className="featured-item-container">
            <Image
                className={"featured-item-image-" + size}
                src={imagePath}
                onClick={() => history.push(url)}
            />
            <h3 onClick={() => history.push(url)} className={"word-wrap-" + size}>
                {data.name}
            </h3>
            Start from ${data.startPrice}
        </div>
    );
}

export default ImageCard;
