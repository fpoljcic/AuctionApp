import React from 'react';
import { Image, Table } from 'react-bootstrap';
import { getLongDateTime } from 'utilities/date';
import MyScrollToTop from 'components/MyScrollToTop';

import './tables.css';

const BidTable = ({ bids }) => {

    return (
        <>
            <Table variant="gray-transparent" responsive>
                <thead>
                    <tr>
                        <th colSpan="2">Bidder</th>
                        <th style={{ minWidth: 190 }}>Date</th>
                        <th style={{ minWidth: 135 }}>Bid</th>
                    </tr>
                </thead>
                <tbody>
                    {bids.map((bid, i) => (
                        <tr key={bid.id}>
                            <td colSpan="2">
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Image style={{ marginRight: 20 }} className="avatar-image-small" src={bid.photo} roundedCircle />
                                    <div className="bid-table-bidder">
                                        {bid.firstName + ' ' + bid.lastName}
                                    </div>
                                </div>
                            </td>
                            <td>{getLongDateTime(bid.date)}</td>
                            <td style={i === 0 ? { color: 'var(--strong-green)', fontWeight: 'bold' } : { fontWeight: 'bold' }}>{'$ ' + bid.price}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <MyScrollToTop />
        </>
    );
}

export default BidTable;
