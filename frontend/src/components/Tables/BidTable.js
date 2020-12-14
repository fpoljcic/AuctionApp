import React, { useState } from 'react';
import { Image, Table } from 'react-bootstrap';
import { getLongDateTime } from 'utilities/date';
import MyScrollToTop from 'components/MyScrollToTop';
import SortTh from './SortTh';

import './tables.css';

const BidTable = ({ bids, setBids }) => {

    const [active, setActive] = useState("price");

    return (
        <>
            <Table variant="gray-transparent" responsive>
                <thead>
                    <tr className="product-table-header">
                        <SortTh colSpan="2" active={active} setActive={setActive} data={bids} setData={setBids} name="name" type="string">Bidder</SortTh>
                        <SortTh style={{ minWidth: 190 }} active={active} setActive={setActive} data={bids} setData={setBids} name="date" type="date">Date</SortTh>
                        <SortTh style={{ minWidth: 135 }} active={active} setActive={setActive} data={bids} setData={setBids} name="price" type="number">Bid</SortTh>
                    </tr>
                </thead>
                <tbody>
                    {bids.map((bid, i) => (
                        <tr key={bid.id}>
                            <td colSpan="2">
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Image style={{ marginRight: 20 }} className="avatar-image-small" src={bid.photo} roundedCircle />
                                    <div className="bid-table-bidder">
                                        {bid.name}
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
