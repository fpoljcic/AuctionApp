import React from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

const SubmitButtons = ({ onBack, lastTab, loading, uploading }) => {

    const renderNextButton = () => {
        switch (true) {
            case lastTab:
                return "DONE";
            case uploading:
                return (
                    <>
                        UPLOADING
                        <Spinner className="text-spinner" animation="border" />
                    </>
                )
            default:
                return (
                    <>
                        NEXT
                        <IoIosArrowForward style={{ fontSize: 24, marginRight: -5, marginLeft: 5 }} />
                    </>
                )
        }
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
                className="sell-submit-button"
                size="xxl"
                variant="transparent-black-shadow-disabled"
                onClick={onBack}
                disabled={loading}
            >
                <IoIosArrowBack style={{ fontSize: 24, marginLeft: -5, marginRight: 5 }} />
                BACK
            </Button>
            <Button
                className="sell-submit-button"
                type="submit"
                size="xxl"
                variant={lastTab ? "fill-purple-shadow" : "transparent-black-shadow"}
                disabled={loading}
            >
                {renderNextButton()}
            </Button>
        </div>
    );
}

export default SubmitButtons;
