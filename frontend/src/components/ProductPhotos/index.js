import React, { useEffect, useState } from 'react';
import { Image, Modal } from 'react-bootstrap';
import { AiOutlineFullscreen } from "react-icons/ai";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

import './productPhotos.css';

const ProductPhotos = ({ photos }) => {

    const [activePhoto, setActivePhoto] = useState(0);
    const [showFullscreen, setShowFullscreen] = useState(false);
    const [showFullscreenIcon, setShowFullscreenIcon] = useState(false);

    const imagePath = photos[activePhoto] !== undefined ? photos[activePhoto].url : "/images/placeholder-image-gray.png";

    useEffect(() => {
        const downHandler = ({ key }) => {
            switch (key) {
                case 'Left':
                case 'ArrowLeft':
                    setActivePhoto(activePhoto !== 0 ? activePhoto - 1 : activePhoto);
                    break;
                case 'Right':
                case 'ArrowRight':
                    setActivePhoto(activePhoto !== photos.length - 1 ? activePhoto + 1 : activePhoto);
                    break;
                default:
                    return;
            }
        };

        window.addEventListener('keydown', downHandler);

        return () => {
            window.removeEventListener('keydown', downHandler);
        };
    }, [activePhoto, photos.length]);

    return (
        <div className="images-container">
            <Modal size="xl" centered show={showFullscreen} onHide={() => setShowFullscreen(false)}>
                {activePhoto !== 0 ?
                    <MdKeyboardArrowLeft onClick={() => setActivePhoto(activePhoto - 1)} className="fullsceen-left-arrow" />
                    : null}
                <Image onClick={() => setShowFullscreen(false)} width="100%" src={imagePath} />
                {activePhoto !== photos.length - 1 ?
                    <MdKeyboardArrowRight onClick={() => setActivePhoto(activePhoto + 1)} className="fullsceen-right-arrow" />
                    : null}
            </Modal>
            <Image
                onClick={() => setShowFullscreen(true)}
                onMouseEnter={() => setShowFullscreenIcon(true)}
                onMouseLeave={() => setShowFullscreenIcon(false)}
                width="100%"
                height="438px"
                src={imagePath}
                style={photos[activePhoto] === undefined ? { objectFit: 'cover' } : null}
                className="product-image-big"
            />
            <AiOutlineFullscreen
                onMouseEnter={() => setShowFullscreenIcon(true)}
                onMouseLeave={() => setShowFullscreenIcon(false)}
                style={!showFullscreenIcon ? { display: 'none' } : null}
                className="fullscreen-icon"
                onClick={() => setShowFullscreen(true)}
            />
            {photos.length !== 0 ?
                <div className="small-images-container">
                    {photos.map((photo, i) => (
                        <Image
                            onClick={() => setActivePhoto(i)}
                            key={photo.id}
                            src={photo.url}
                            className="product-image-small"
                            style={activePhoto === i ? { border: '2px solid var(--primary)' } : { opacity: 0.7 }}
                        />
                    ))}
                </div> : null}
        </div>
    );
}

export default ProductPhotos;
