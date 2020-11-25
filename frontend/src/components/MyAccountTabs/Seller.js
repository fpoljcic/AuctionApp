import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Spinner } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import ProductTable from 'components/ProductTable';
import StartSellingTab from 'components/StartSellingTab';
import { myAccountSellerSellUrl } from 'utilities/appUrls';
import { getUserProducts } from 'api/product';
import moment from 'moment';

import './myAccountTabs.css';

const Seller = () => {
    const history = useHistory();

    const [activeTab, setActiveTab] = useState(0);
    const [scheduledProducts, setScheduledProducts] = useState([]);
    const [activeProducts, setActiveProducts] = useState([]);
    const [soldProducts, setSoldProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const tabs = [
        <ProductTable type="scheduled" products={scheduledProducts} />,
        <ProductTable type="active" products={activeProducts} />,
        <ProductTable type="sold" products={soldProducts} />
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getUserProducts();
                setScheduledProducts(data.filter(product => moment.utc(product.startDate).isAfter(moment())));
                setActiveProducts(data.filter(product => moment.utc(product.endDate).isAfter(moment()) && moment(product.startDate).isSameOrBefore(moment())));
                setSoldProducts(data.filter(product => moment.utc(product.endDate).isSameOrBefore(moment())));
            } catch (e) { }
            setLoading(false);
        }

        fetchData();
    }, [])

    const renderEmpty = () => {
        switch (true) {
            case activeTab === 0 && scheduledProducts.length === 0:
                return <StartSellingTab />;
            case activeTab === 1 && activeProducts.length === 0:
                return <div className="no-table-items font-18"> No active items found </div>;
            case activeTab === 2 && soldProducts.length === 0:
                return <div className="no-table-items font-18"> No sold items found </div>;
            default:
                return null;
        }
    }

    return (
        <>
            <div className="seller-tab-buttons">
                <Button style={{ width: 120, borderBottom: 'none' }} onClick={() => setActiveTab(0)} variant={activeTab === 0 ? "fill-purple" : "fill-gray-2"} size="lg-3">
                    Scheduled
                </Button>
                <Button className="seller-tab-middle-button" onClick={() => setActiveTab(1)} variant={activeTab === 1 ? "fill-purple" : "fill-gray-2"} size="lg-3">
                    Active
                </Button>
                <Button style={{ width: 120, borderBottom: 'none' }} onClick={() => setActiveTab(2)} variant={activeTab === 2 ? "fill-purple" : "fill-gray-2"} size="lg-3">
                    Sold
                </Button>
                <Button style={{ position: 'absolute', right: 0, bottom: 0 }} onClick={() => history.push(myAccountSellerSellUrl)} variant="fill-purple" size="xl">
                    <FaPlus style={{ fontSize: 22, marginRight: 8 }} />
                    ADD NEW ITEM
                </Button>
            </div>
            {tabs[activeTab]}
            {loading ?
                <div className="no-table-items font-18">
                    <Spinner className="table-spinner" animation="border" />
                </div> : renderEmpty()}
        </>
    );
}

export default Seller;
