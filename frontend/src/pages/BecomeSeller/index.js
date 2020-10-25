import React, { useEffect, useState } from 'react';
import { useBreadcrumbContext } from 'AppContext';
import { myAccountSellerUrl, myAccountUrl } from 'utilities/appUrls';
import { Step, Stepper } from 'react-form-stepper';
import SellerTab1 from 'components/SellerTabs/SellerTab1';
import SellerTab2 from 'components/SellerTabs/SellerTab2';
import SellerTab3 from 'components/SellerTabs/SellerTab3';

import './becomeSeller.css';

const BecomeSeller = () => {
    const { setBreadcrumb } = useBreadcrumbContext();

    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        setBreadcrumb("MY ACCOUNT", [{ text: "MY ACCOUNT", href: myAccountUrl }, { text: "BECOME SELLER", href: myAccountSellerUrl }]);
        // eslint-disable-next-line 
    }, [])

    const renderTab = () => {
        switch (activeTab) {
            case 0:
                return (
                    <SellerTab1 />
                )
            case 1:
                return (
                    <SellerTab2 />
                )
            case 2:
                return (
                    <SellerTab3 />
                )
            default:
                return null;
        }
    }

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
            >
                {renderStep(activeTab >= 0)}
                {renderStep(activeTab >= 1)}
                {renderStep(activeTab >= 2)}
            </Stepper>
            {renderTab()}
        </>
    );
}

export default BecomeSeller;
