import React, { useEffect, useState } from 'react';
import { useBreadcrumbContext } from 'AppContext';
import { Step, Stepper } from 'react-form-stepper';
import { myAccountSellerSellUrl, myAccountSellerUrl, myAccountUrl } from 'utilities/appUrls';
import { getCategories } from 'api/category';
import { getSubcategoriesForCategory } from 'api/subcategory';
import { addProduct, getProductFilters } from 'api/product';
import SellTab1 from 'components/SellTabs/SellTab1';
import SellTab2 from 'components/SellTabs/SellTab2';
import SellTab3 from 'components/SellTabs/SellTab3';
import MyPrompt from 'components/MyPrompt';
import { getUser } from 'utilities/localStorage';
import { scrollToTop } from 'utilities/common';

import './sell.css';

const Sell = () => {
    const { setBreadcrumb } = useBreadcrumbContext();

    const user = getUser();

    const [activeTab, setActiveTab] = useState(0);
    const [promptVisible, setPromptVisible] = useState(false);
    const [product, setProduct] = useState({ street: user.street, country: user.country, city: user.city, zip: user.zip, phone: user.phone });

    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [filters, setFilters] = useState({ colors: [], sizes: [] });

    const selectCategory = async (e, handleChange) => {
        handleChange(e);
        setSubcategories([]);
        setSubcategories(await getSubcategoriesForCategory(e.target.value));
    }

    const onDone = async (product) => {
        product.phone = product.callCode + product.phone;
        delete product.callCode;
        product.photos = product.photos.map(photo => photo.url);
        try {
            const id = await addProduct(product);
            const categoryName = categories.filter(category => category.id === product.categoryId)[0].name;
            const subcategoryName = subcategories.filter(subcategory => subcategory.id === product.subcategoryId)[0].name;
            setPromptVisible(false);
            return {
                id, categoryName, subcategoryName
            };
        } catch (e) {
            return null;
        }
    }

    const tabs = [
        <SellTab1
            categories={categories}
            filters={filters}
            subcategories={subcategories}
            selectCategory={selectCategory}
            product={product}
            setProduct={setProduct}
            setActiveTab={setActiveTab}
        />,
        <SellTab2 product={product} setProduct={setProduct} setActiveTab={setActiveTab} />,
        <SellTab3 product={product} setProduct={setProduct} setActiveTab={setActiveTab} onDone={onDone} />
    ];

    useEffect(() => {
        setBreadcrumb("MY ACCOUNT", [
            { text: "MY ACCOUNT", href: myAccountUrl },
            { text: "SELLER", href: myAccountSellerUrl },
            { text: "SELL", href: myAccountSellerSellUrl }
        ]);

        const fetchData = async () => {
            try {
                setCategories(await getCategories());
                setFilters(await getProductFilters());
            } catch (e) { }
        }

        fetchData();
        // eslint-disable-next-line 
    }, [])

    useEffect(() => {
        scrollToTop(false);
    }, [activeTab])

    useEffect(() => {
        if (activeTab !== 0)
            setPromptVisible(true);
    }, [activeTab])

    const renderStep = (active) => (
        <Step>
            <div className="white-circle">
                <div style={active ? { backgroundColor: 'var(--primary)' } : { backgroundColor: 'var(--lighter-silver)' }} className="purple-circle" />
            </div>
        </Step>
    )

    return (
        <>
            <MyPrompt promptVisible={promptVisible} />
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
