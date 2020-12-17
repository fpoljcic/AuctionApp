import React, { useState } from 'react';
import { Image, Table } from 'react-bootstrap';
import { IoMdRemoveCircleOutline } from "react-icons/io";
import { getLongDateTime } from 'utilities/date';
import { getUserId } from 'utilities/localStorage';
import MyScrollToTop from 'components/MyScrollToTop';
import Confirm from 'components/Modals/Confirm';
import { useAlertContext } from 'AppContext';
import { removeBid } from 'api/bid';
import SortTh from './SortTh';

import './tables.css';

const BidTable = ({ bids, setBids, sort, setSort, active }) => {
    const { showMessage } = useAlertContext();
    const personId = getUserId();

    const [bidId, setBidId] = useState(null);
    const [message, setMessage] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);

    const removeClick = (price, id) => {
        setBidId(id);
        setMessage(
            <div style={{ textAlign: 'center' }}>
                Are you sure you want to delete your bid of ${price} for this product?
            </div>
        );
        setShowConfirm(true);
    }

    const onConfirm = async () => {
        try {
            await removeBid(bidId, null);
            showMessage("success", "You have successfully deleted a bid");
            setBids([...bids].filter(bid => bid.id !== bidId));
            setBidId(null);
        } catch (e) { }
    }

    return (
        <>
            <Table variant="gray-transparent" responsive>
                <Confirm showModal={showConfirm} setShowModal={setShowConfirm} message={message} onConfirm={onConfirm} />
                <thead>
                    <tr className="product-table-header">
                        <SortTh colSpan="2" active={sort} setActive={setSort} data={bids} setData={setBids} name="name" type="string">Bidder</SortTh>
                        <SortTh style={{ minWidth: 190 }} active={sort} setActive={setSort} data={bids} setData={setBids} name="date" type="date">Date</SortTh>
                        <SortTh style={{ minWidth: 205 }} active={sort} setActive={setSort} data={bids} setData={setBids} name="price" type="number">Bid</SortTh>
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
                            <td style={i === 0 ? { color: 'var(--strong-green)', fontWeight: 'bold' } : { fontWeight: 'bold' }}>
                                <div className="bid-table-btns">
                                    {'$ ' + bid.price}
                                    {active && bid.personId === personId ?
                                        <IoMdRemoveCircleOutline
                                            className="table-remove-btn"
                                            onClick={() => removeClick(bid.price, bid.id)}
                                        /> : null}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <MyScrollToTop />
        </>
    );
}

export default BidTable;
