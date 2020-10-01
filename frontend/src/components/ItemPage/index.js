import React, { useEffect, useState } from 'react';
import { Button, Form, Image, Modal, Table } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { getUserId } from 'utilities/Common';
import { IoIosArrowForward } from "react-icons/io";
import { RiHeartFill } from "react-icons/ri";
import { AiOutlineFullscreen } from "react-icons/ai";
import { getBidsForProduct, getProduct, bidForProduct } from 'utilities/ServerCalls';
import moment from 'moment';

import './itemPage.css';

const ItemPage = ({ match, setBreadcrumb, showMessage }) => {

    const [product, setProduct] = useState(null);
    const [bids, setBids] = useState([]);
    const [activePhoto, setActivePhoto] = useState(0);
    const [showFullscreen, setShowFullscreen] = useState(false);
    const [showFullscreenIcon, setShowFullscreenIcon] = useState(false);
    const [loading, setLoading] = useState(false);
    const [active, setActive] = useState(true);
    const [ownProduct, setOwnProduct] = useState(false);
    const [bidPrice, setBidPrice] = useState(null);

    useEffect(() => {
        formBreadcrumb();
        const fetchData = async () => {
            const productId = match.params.id;
            const personId = getUserId();
            const productRes = await getProduct(productId, personId);
            setActive(moment().isBetween(moment(productRes.startDate), moment(productRes.endDate), null, "[)"));
            setOwnProduct(productRes.personId === personId);
            setProduct(productRes);
            setBids(await getBidsForProduct(productId));
        }

        fetchData();
        // eslint-disable-next-line
    }, [])

    const formBreadcrumb = () => {
        const urlElements = match.url.split("/").slice(1, -1);
        setBreadcrumb("SINGLE PRODUCT", [...urlElements.map((el, i) => {
            return {
                text: el.toUpperCase().split("_").join(" "),
                href: "/" + urlElements.slice(0, i + 1).join("/")
            }
        }), { text: "SINGLE PRODUCT" }]);
    }

    const bid = async () => {
        setLoading(true);
        const price = bidPrice;
        const response = await bidForProduct(parseFloat(price), product.id);
        if (response.status === 200) {
            const newBids = await getBidsForProduct(product.id);
            if (getUserId() === newBids[0].personId)
                showMessage("success", "Congratulations! You are the highest bider!");
            else
                showMessage("warning", "There are higher bids than yours. You could give a second try!");
            setBids(newBids);
        }
        setLoading(false);
    }

    const getTimeInfo = () => {
        const productStartDate = moment(product.startDate)
        if (moment().isBefore(productStartDate))
            return (
                <>
                    Time start: {productStartDate.format("D MMMM YYYY [at] HH:mm")}
                    <br />
                    Time end: {moment(product.endDate).format("D MMMM YYYY [at] HH:mm")}
                </>
            );
        const timeLeft = !active ? 0 : moment.duration(moment(product.endDate).diff(moment())).format("D [days] h [hours] m [minutes]");
        return (
            <>
                Time left: {timeLeft}
            </>
        );
    }

    return (
        <>
            {product !== null ? (
                <>
                    <Modal size="xl" centered show={showFullscreen} onHide={() => setShowFullscreen(false)}>
                        <Image onClick={() => setShowFullscreen(false)} width="100%" src={product.photos[activePhoto].url} />
                    </Modal>
                    <div className="product-container">
                        <div className="images-container">
                            <Image
                                onClick={() => setShowFullscreen(true)}
                                onMouseEnter={() => setShowFullscreenIcon(true)}
                                onMouseLeave={() => setShowFullscreenIcon(false)}
                                key={product.photos[0].id}
                                width="100%"
                                height="438px"
                                src={product.photos[activePhoto].url}
                                className="product-image-big"
                            />
                            <AiOutlineFullscreen
                                onMouseEnter={() => setShowFullscreenIcon(true)}
                                onMouseLeave={() => setShowFullscreenIcon(false)}
                                style={!showFullscreenIcon ? { display: 'none' } : null}
                                className="fullscreen-icon"
                                onClick={() => setShowFullscreen(true)}
                            />
                            {product.photos.map((photo, i) => (
                                <Image
                                    onClick={() => setActivePhoto(i)}
                                    key={photo.id}
                                    width="110px"
                                    height="110px"
                                    src={photo.url}
                                    className="product-image-small"
                                    style={activePhoto === i ? { border: '2px solid #8367D8' } : null}
                                />
                            ))}
                        </div>

                        <div className="product-info-container">
                            <div>
                                <h1>
                                    {product.name}
                                </h1>
                                <div style={{ marginTop: 10 }} className="featured-product-price">
                                    Start from ${product.startPrice}
                                </div>
                            </div>
                            <div className="place-bid-container">
                                <div>
                                    <Form.Control disabled={ownProduct || !active || loading} maxLength="7" className="form-control-gray place-bid-form" size="xl-18" type="text" onChange={e => setBidPrice(e.target.value)} />
                                    <div className="place-bid-label">
                                        Enter ${product.startPrice} or more
                                    </div>
                                </div>
                                <Button disabled={ownProduct || !active || loading || isNaN(bidPrice) || bidPrice < product.startPrice} style={{ width: 192, padding: 0 }} size="xxl" variant="transparent-black-shadow" onClick={bid}>
                                    PLACE BID
                                    <IoIosArrowForward style={{ fontSize: 24 }} />
                                </Button>
                            </div>
                            <div style={{ color: '#9B9B9B' }}>
                                Highest bid: {' '}
                                <span style={{ color: '#8367D8', fontWeight: 'bold' }}>
                                    ${bids[0] === undefined ? 0 : bids[0].price}
                                </span>
                                <br />
                                No bids: {bids.length}
                                <br />
                                {getTimeInfo()}
                            </div>
                            <div>
                                <Button className="wishlist-button" style={product.wished ? { borderColor: '#8367D8' } : null} variant="transparent-gray">
                                    Wishlist
                                    {product.wished ? (
                                        <RiHeartFill style={{ fontSize: 22, marginLeft: 5, color: '#8367D8' }} />
                                    ) : (
                                            <RiHeartFill style={{ fontSize: 22, marginLeft: 5, color: '#ECECEC' }} />
                                        )}
                                </Button>
                                <div className="font-18" style={{ marginTop: 15 }}>
                                    Details
                                    <div className="gray-line" />
                                    <div className="font-15">
                                        {product.description}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
            <Table variant="gray-transparent" responsive>
                <thead>
                    <tr>
                        <th colSpan="2">Bider</th>
                        <th>Date</th>
                        <th>Bid</th>
                    </tr>
                </thead>
                <tbody>
                    {bids.map((bid, i) => (
                        <tr key={bid.id}>
                            <td style={{ fontWeight: 'bold' }} colSpan="2">
                                <Image style={{ marginRight: 20 }} className="avatar-image-small" src={bid.photo} roundedCircle />
                                {bid.firstName + ' ' + bid.lastName}
                            </td>
                            <td>{moment(bid.date).format("D MMMM YYYY")}</td>
                            <td style={i === 0 ? { color: '#6CC047', fontWeight: 'bold' } : { fontWeight: 'bold' }}>{'$ ' + bid.price}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
}

export default withRouter(ItemPage);
