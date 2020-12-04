import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Image, OverlayTrigger, Table, Tooltip } from 'react-bootstrap';
import { getDurationBetweenDates, getLongDateTime } from 'utilities/date';
import { myAccountBidsPayUrl, productUrl } from 'utilities/appUrls';
import { getUserId } from 'utilities/localStorage';
import Receipt from 'components/Modals/Receipt';
import MyScrollToTop from 'components/MyScrollToTop';
import moment from 'moment';

import './tables.css';

const ProductTable = ({ products, type }) => {
    const history = useHistory();
    const userId = getUserId();

    const [showModal, setShowModal] = useState(false);
    const [productId, setProductId] = useState(null);

    const getTimeColumnName = () => {
        switch (type) {
            case "scheduled":
                return "Time Start";
            case "sold":
                return "Time End";
            default:
                return "Time Left";
        }
    }

    const getTimeColumn = (product) => {
        switch (type) {
            case "scheduled":
                return getLongDateTime(product.startDate);
            case "sold":
                return getLongDateTime(product.endDate);
            default:
                const productEndDate = moment.utc(product.endDate);
                return moment().isSameOrAfter(productEndDate) ? "0s" : getDurationBetweenDates(moment(), productEndDate);
        }
    }

    const getImageSrc = (product) => product.url !== null ? product.url : "/images/placeholder-image-gray.png";

    const getMaxBidStyle = (product) => {
        switch (true) {
            case product.maxBid === null:
                return { fontWeight: 'bold' };
            case product.personId === userId || (type === "sold" && product.paid):
                return { color: 'var(--strong-green)', fontWeight: 'bold' };
            default:
                return { color: 'var(--cyan-blue)', fontWeight: 'bold' };
        }
    }

    const handlePayClick = (product) => {
        if (product.paid) {
            setProductId(product.id);
            setShowModal(true);
            return;
        }
        history.push({
            pathname: myAccountBidsPayUrl,
            state: { product }
        });
    }

    const handleViewClick = (product) => {
        if (type === "sold" && product.paid) {
            setProductId(product.id);
            setShowModal(true);
            return;
        }
        history.push(productUrl(product));
    }

    const handleCheckClick = (product) => {
        history.push({
            pathname: productUrl(product),
            state: { withMessage: type === "bids" && product.paid }
        });
    }

    return (
        <>
            <Table variant="gray-transparent" responsive>
                <Receipt showModal={showModal} setShowModal={setShowModal} productId={productId} />
                <thead>
                    <tr className="product-table-header">
                        <th style={{ width: 80 }}>Item</th>
                        <th>Name</th>
                        <th style={{ minWidth: 178 }}>{getTimeColumnName()}</th>
                        <th style={{ minWidth: 135 }}>Your Price</th>
                        <th style={{ minWidth: 96 }}>No. Bids</th>
                        <th style={{ minWidth: 135 }}>Highest Bid</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td>
                                <Image style={{ cursor: 'pointer' }} onClick={() => handleCheckClick(product)} className="avatar-image-medium" src={getImageSrc(product)} />
                            </td>
                            <td>
                                <div style={{ cursor: 'pointer' }} onClick={() => handleCheckClick(product)} className="product-table-name">
                                    {product.name}
                                </div>
                                <OverlayTrigger
                                    placement="bottom"
                                    overlay={
                                        <Tooltip>
                                            {product.id}
                                        </Tooltip>
                                    }
                                >
                                    <div className="product-table-id">
                                        #{product.id.substring(0, 8)}
                                    </div>
                                </OverlayTrigger>
                            </td>
                            <td>
                                {getTimeColumn(product)}
                            </td>
                            <td style={type === "bids" && product.personId === userId ? { color: 'var(--strong-green)', fontWeight: 'bold' } : null}>
                                $ {product.price}
                            </td>
                            <td>{product.bidCount}</td>
                            <td style={getMaxBidStyle(product)}>
                                {product.maxBid !== null ? "$ " + product.maxBid : "/"}
                            </td>
                            <td>
                                {type === "bids" && moment().isSameOrAfter(moment.utc(product.endDate)) && product.personId === userId ?
                                    <Button
                                        size="lg-2"
                                        variant={product.paid ? "transparent-black-shadow-disabled" : "fill-purple-shadow"}
                                        style={{ width: 105 }}
                                        onClick={() => handlePayClick(product)}
                                    >
                                        {product.paid ? "RECEIPT" : "PAY"}
                                    </Button> :
                                    <Button
                                        size="lg-2"
                                        variant="transparent-black-shadow-disabled"
                                        style={{ width: 105 }}
                                        onClick={() => handleViewClick(product)}
                                    >
                                        {type === "sold" && product.paid ? "RECEIPT" : "VIEW"}
                                    </Button>
                                }
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <MyScrollToTop />
        </>
    );
}

export default ProductTable;
