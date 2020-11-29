import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { getReceipt } from 'api/payment';
import { longDateTimeFormat } from 'utilities/date';
import moment from 'moment';

import './modal.css';

const Receipt = ({ showModal, setShowModal, productId }) => {

    const [receipt, setReceipt] = useState({});

    useEffect(() => {
        if (productId === null)
            return;
        const fetchData = async () => {
            try {
                setReceipt(await getReceipt(productId));
            } catch (e) { }
        }
        fetchData();

    }, [productId])

    return (
        <Modal size="xl" centered show={showModal} onHide={() => setShowModal(false)}>
            <div style={{ margin: '0 auto', width: '100%' }}>
                <div className="tab-title">
                    RECEIPT
                </div>
                <div className="tab-content">
                    <div className="receipt-part-title">
                        Transaction information
                    </div>
                    <div className="gray-line" />
                    <div className="receipt-part">
                        <span>
                            <span className="receipt-label">
                                Transaction ID:
                            </span>
                            {receipt.id}
                        </span>
                        <span>
                            <span className="receipt-label">
                                Date:
                            </span>
                            {moment.utc(receipt.date).local().format(longDateTimeFormat)}
                        </span>
                        <span>
                            <span className="receipt-label">
                                Amount:
                            </span>
                            ${receipt.amount}
                        </span>
                    </div>

                    <div className="receipt-part-title">
                        Product information
                    </div>
                    <div className="gray-line" />
                    <div className="receipt-part">
                        <span>
                            <span className="receipt-label">
                                Name:
                            </span>
                            {receipt.name}
                        </span>
                        <span>
                            <span className="receipt-label">
                                Color:
                            </span>
                            {receipt.color ? receipt.color : "/"}
                        </span>
                        <span>
                            <span className="receipt-label">
                                Size:
                            </span>
                            {receipt.size ? receipt.size : "/"}
                        </span>
                        <span>
                            <span className="receipt-label">
                                Shipping:
                            </span>
                            {receipt.shipping ? "Yes" : "No"}
                        </span>
                        <span>
                            <span className="receipt-label">
                                Description:
                            </span>
                            {receipt.description}
                        </span>
                    </div>

                    <div className="receipt-part-title">
                        Seller information
                    </div>
                    <div className="gray-line" />
                    <div className="receipt-part">
                        <span>
                            <span className="receipt-label">
                                Full Name:
                            </span>
                            {receipt.sellerName}
                        </span>
                        <span>
                            <span className="receipt-label">
                                Street:
                            </span>
                            {receipt.sellerStreet}
                        </span>
                        <span>
                            <span className="receipt-label">
                                Country:
                            </span>
                            {receipt.sellerCountry}
                        </span>
                        <span>
                            <span className="receipt-label">
                                City:
                            </span>
                            {receipt.sellerCity}
                        </span>
                        <span>
                            <span className="receipt-label">
                                Zip:
                            </span>
                            {receipt.sellerZip}
                        </span>
                        <span>
                            <span className="receipt-label">
                                Phone:
                            </span>
                            {receipt.sellerPhone}
                        </span>
                    </div>

                    <div className="receipt-part-title">
                        Shipping information
                    </div>
                    <div className="gray-line" />
                    <div className="receipt-part">
                        <span>
                            <span className="receipt-label">
                                Street:
                            </span>
                            {receipt.street}
                        </span>
                        <span>
                            <span className="receipt-label">
                                Country:
                            </span>
                            {receipt.country}
                        </span>
                        <span>
                            <span className="receipt-label">
                                City:
                            </span>
                            {receipt.city}
                        </span>
                        <span>
                            <span className="receipt-label">
                                Zip:
                            </span>
                            {receipt.zip}
                        </span>
                        <span>
                            <span className="receipt-label">
                                Phone:
                            </span>
                            {receipt.phone}
                        </span>
                    </div>
                    <Button
                        size="lg-2"
                        variant="fill-purple-shadow"
                        style={{ width: 120, margin: '0 auto' }}
                        onClick={() => setShowModal(false)}
                    >
                        OK
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

export default Receipt;
