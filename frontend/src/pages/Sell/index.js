import React, { useEffect, useState } from 'react';
import { useBreadcrumbContext } from 'AppContext';
import { myAccountSellerSellUrl, myAccountSellerUrl, myAccountUrl } from 'utilities/appUrls';
import { Step, Stepper } from 'react-form-stepper';
import SellerTab1 from 'components/SellerTabs/SellerTab1';
import SellerTab2 from 'components/SellerTabs/SellerTab2';
import SellerTab3 from 'components/SellerTabs/SellerTab3';

import './sell.css';

const Sell = () => {
    const { setBreadcrumb } = useBreadcrumbContext();

    const [activeTab, setActiveTab] = useState(0);
    const [product, setProduct] = useState({});

    const tabs = [
        <SellerTab1 product={product} setProduct={setProduct} setActiveTab={setActiveTab} />,
        <SellerTab2 product={product} setProduct={setProduct} setActiveTab={setActiveTab} />,
        <SellerTab3 product={product} setProduct={setProduct} setActiveTab={setActiveTab} />
    ];

    useEffect(() => {
        setBreadcrumb("MY ACCOUNT", [
            { text: "MY ACCOUNT", href: myAccountUrl },
            { text: "SELLER", href: myAccountSellerUrl },
            { text: "SELL", href: myAccountSellerSellUrl }
        ]);
        // eslint-disable-next-line 
    }, [])

    const renderStep = (active) => (
        <Step>
            <div className="white-circle">
                <div style={active ? { backgroundColor: 'var(--primary)' } : { backgroundColor: 'var(--lighter-silver)' }} className="purple-circle" />
            </div>
        </Step>
    )

    return (
        <>
            <Stepper
                activeStep={activeTab}
                styleConfig={{
                    activeBgColor: 'var(--primary)',
                    circleFontSize: 0,
                    completedBgColor: 'var(--primary)',
                    inactiveBgColor: 'var(--lighter-silver)',
                    size: '28px'
                }}
                connectorStateColors={true}
                connectorStyleConfig={{
                    activeColor: 'var(--primary)',
                    completedColor: 'var(--primary)',
                    disabledColor: 'var(--lighter-silver)',
                    size: '5px'
                }}
                className="sell-stepper"
            >
                {renderStep(activeTab >= 0)}
                {renderStep(activeTab >= 1)}
                {renderStep(activeTab >= 2)}
            </Stepper>
            {tabs[activeTab]}
        </>
    );
}

export default Sell;
