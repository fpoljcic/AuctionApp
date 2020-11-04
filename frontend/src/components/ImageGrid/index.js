import React, { useRef } from "react";
import { Image } from "react-bootstrap";
import { useDrag, useDrop } from "react-dnd";

import './imageGrid.css';

const type = "ImageItem";

const ImageItem = ({ image, index, moveImage }) => {
    const ref = useRef(null);

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
        item: { type, index },
        collect: monitor => ({
            isDragging: monitor.isDragging()
        })
    });

    drag(drop(ref));

    return (
        <div
            ref={ref}
            style={{ opacity: isDragging ? 0.4 : 1 }}
            className="file-item"
        >
            <Image
                className="file-img"
                src={image.src}
                style={image.url !== undefined ? { border: '2px solid var(--primary)' } : null}
            />
        </div>
    );
};

const ImageGrid = ({ images, moveImage }) => {

    return (
        <div className="file-list">
            {images.map((image, index) =>
                <ImageItem
                    image={image}
                    index={index}
                    key={index}
                    moveImage={moveImage}
                />
            )}
        </div>
    );
};

export default ImageGrid;
