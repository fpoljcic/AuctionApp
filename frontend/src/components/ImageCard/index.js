import React from 'react';
import { Image } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import './imageCard.css';

const ImageCard = ({ data, size, url }) => {
    const history = useHistory();

    return (
        <div className="featured-item-container">
            <Image
                className={"featured-item-image-" + size}
                src={data.url}
                onClick={() => history.push(url)}
            />
            <h3>
                {data.name}
            </h3>
            Start from ${data.startPrice}
        </div>
    );
}

export default ImageCard;
