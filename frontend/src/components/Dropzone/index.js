import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import ImageGrid from "components/ImageGrid";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import update from "immutability-helper";
import { Form } from "react-bootstrap";

import './dropzone.css';

const isTouchDevice = () => {
    if ("ontouchstart" in window) {
        return true;
    }
    return false;
};

const backendForDND = isTouchDevice() ? TouchBackend : HTML5Backend;

const getClassName = (className, isActive) => {
    if (!isActive) return className;
    return `${className} ${className}-active`;
};

const Dropzone = ({ onDrop, accept, images, setImages }) => {

    const [disabled, setDisabled] = useState(false);

    const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
        onDrop,
        accept,
        disabled,
        maxSize: 15728640
    });

    const moveImage = (dragIndex, hoverIndex) => {
        const draggedImage = images[dragIndex];
        setImages(
            update(images, {
                $splice: [[dragIndex, 1], [hoverIndex, 0, draggedImage]]
            })
        );
    };

    useEffect(() => {
        setDisabled(images.length === 10);
    }, [images])

    const getFileErrorMessage = (fileRejections) => {
        if (fileRejections.length === 0)
            return;
        const error = fileRejections[0].errors[0];
        switch (error.code) {
            case "file-invalid-type":
                return "*Invalid image format";
            case "file-too-large":
                return "*Images can't be larger than 15 MB";
            default:
                return "*" + error.message;
        }
    }

    return (
        <>
            <div className={getClassName("dropzone", isDragActive)} {...getRootProps()}>
                <input className="dropzone-input" {...getInputProps()} />
                <div className="dropzone-content">
                    <DndProvider backend={backendForDND}>
                        <ImageGrid images={images} setImages={setImages} moveImage={moveImage} />
                    </DndProvider>
                    <div style={{ margin: 'auto 10px' }}>
                        {isDragActive ? (
                            "Release to drop the image here"
                        ) : (
                                <>
                                    <span style={{ color: 'var(--primary)' }}>
                                        Upload photos
                                </span>
                                    {' '} or just drag and drop
                                <div>
                                        {images.length > 1 ? "(Tip: Drag the images to change their position)" : null}
                                    </div>
                                </>
                            )}
                    </div>
                </div>
            </div>
            <Form.Control.Feedback style={{ position: 'absolute', width: 'unset' }} className={fileRejections.length > 0 ? "d-block" : null} type="invalid">
                {getFileErrorMessage(fileRejections)}
            </Form.Control.Feedback>
        </>
    );
};

export default Dropzone;
