import React, { useRef, useState } from "react";
import { Image, Modal } from "react-bootstrap";
import { useDrag, useDrop } from "react-dnd";
import { FaRegTrashAlt } from "react-icons/fa";
import { isTouchDevice } from "utilities/common";

import './imageGrid.css';

const type = "ImageItem";

const ImageItem = ({ image, index, moveImage, images, setImages }) => {
    const ref = useRef(null);

    const [showTrash, setShowTrash] = useState(isTouchDevice);
    const [showFullscreen, setShowFullscreen] = useState(false);

    const [, drop] = useDrop({
        accept: type,
        hover(item) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;
            if (dragIndex === hoverIndex) {
                return;
            }
            moveImage(dragIndex, hoverIndex);
            item.index = hoverIndex;
        }
    });

    const [{ isDragging }, drag] = useDrag({
        item: { type, index, id: image.id },
        collect: monitor => ({
            isDragging: monitor.isDragging()
        })
    });

    drag(drop(ref));

    const deleteImage = (e, image) => {
        e.stopPropagation();
        setImages([...images.filter(img => img.id !== image.id)]);
    }

    return (
        <div
            ref={ref}
            style={{ opacity: isDragging ? 0.4 : 1 }}
            className="file-item"
            onMouseEnter={() => setShowTrash(true)}
            onMouseLeave={() => setShowTrash(false)}
            onClick={e => e.stopPropagation()}
        >
            <Modal size="xl" centered show={showFullscreen} onHide={() => setShowFullscreen(false)}>
                <Image onClick={() => setShowFullscreen(false)} width="100%" src={image.src} />
            </Modal>
            <Image
                className="file-img"
                src={image.src}
                style={image.url !== undefined ? { border: '2px solid var(--primary)' } : null}
                onMouseDown={() => setShowTrash(false || isTouchDevice)}
                onClick={() => setShowFullscreen(true)}
            />
            {showTrash ?
                <div className="image-clear-bg" onClick={e => deleteImage(e, image)}>
                    <FaRegTrashAlt className="image-clear-icon" />
                </div> : null}
        </div>
    );
};

const ImageGrid = ({ images, moveImage, setImages }) => {

    return (
        <div className="file-list">
            {images.map((image, index) =>
                <ImageItem
                    image={image}
                    index={index}
                    key={index}
                    moveImage={moveImage}
                    images={images}
                    setImages={setImages}
                />
            )}
        </div>
    );
};

export default ImageGrid;
