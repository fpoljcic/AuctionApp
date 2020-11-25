import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Image, OverlayTrigger, Table, Tooltip } from 'react-bootstrap';
import { getDurationBetweenDates, longDateTimeFormat } from 'utilities/date';
import { productUrl } from 'utilities/appUrls';
import moment from 'moment';

import './productTable.css';

const ProductTable = ({ products, type }) => {
    const history = useHistory();

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
                return moment.utc(product.startDate).local().format(longDateTimeFormat);
            case "sold":
                return moment.utc(product.endDate).local().format(longDateTimeFormat);
            default:
                return getDurationBetweenDates(moment(), moment.utc(product.endDate));;
        }
    }

    const getImageSrc = (product) => product.url !== null ? product.url : "/images/placeholder-image-gray.png";

    return (
        <Table variant="gray-transparent" responsive>
            <thead>
                <tr className="product-table-header">
                    <th style={{ width: 80 }}>Item</th>
                    <th>Name</th>
                    <th>{getTimeColumnName()}</th>
                    <th style={{ minWidth: 130 }}>Your Price</th>
                    <th style={{ minWidth: 100 }}>No. Bids</th>
                    <th style={{ minWidth: 130 }}>Highest Bid</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {products.map(product => (
                    <tr key={product.id}>
                        <td>
                            <Image style={{ cursor: 'pointer' }} onClick={() => history.push(productUrl(product))} className="avatar-image-medium" src={getImageSrc(product)} />
                        </td>
                        <td>
                            <div style={{ cursor: 'pointer' }} onClick={() => history.push(productUrl(product))} className="product-table-name">
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
                        <td>$ {product.startPrice}</td>
                        <td>{product.bidCount}</td>
                        <td style={product.maxBid !== null ? { color: 'var(--cyan-blue)', fontWeight: 'bold' } : { fontWeight: 'bold' }}>
                            {product.maxBid !== null ? "$ " + product.maxBid : "/"}
                        </td>
                        <td>
                            <Button
                                size="lg-2"
                                variant="transparent-black-shadow-disabled"
                                style={{ width: 105 }}
                                onClick={() => history.push(productUrl(product))}
                            >
                                VIEW
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}

export default ProductTable;
