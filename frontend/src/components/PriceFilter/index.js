import React, { useEffect, useState } from 'react';
import { Range } from 'rc-slider';

import './priceFilter.css';

const PriceFilter = ({ minPrice: minPriceSearch, maxPrice: maxPriceSearch, filterCount, handleClick }) => {
    const [price, setPrice] = useState(null);
    const [minPrice, setMinPrice] = useState(minPriceSearch);
    const [maxPrice, setMaxPrice] = useState(maxPriceSearch);
    const [avgPrice, setAvgPrice] = useState(0);
    const [maxCount, setMaxCount] = useState(0);

    useEffect(() => {
        if (filterCount.price === undefined)
            return;
        setPrice(filterCount.price);
        setMinPrice(minPriceSearch === undefined ? Math.floor(filterCount.price.minPrice) : minPriceSearch);
        setMaxPrice(maxPriceSearch === undefined ? Math.ceil(filterCount.price.maxPrice) : maxPriceSearch);
        setAvgPrice(filterCount.price.avgPrice);
        setMaxCount(Math.max.apply(0, filterCount.price.prices));
        // eslint-disable-next-line
    }, [filterCount.price])

    const handleChange = (price) => {
        setMinPrice(price[0]);
        setMaxPrice(price[1]);
    }

    const handleAfterChange = (price) => {
        handleClick({ minPrice: price[0], maxPrice: price[1] });
    }

    return (
        <div className="price-filter-container">
            <div style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
                FILTER BY PRICE
            </div>
            <div className="price-range-container">
                {price !== null ?
                    <>
                        <div className="histogram-container">
                            {price.prices.map((count, i) => (
                                <div
                                    key={i}
                                    className="histogram-bar"
                                    style={{ width: 'calc(100% / ' + price.prices.length + ')', height: count === 0 ? 0 : 'calc(70px / ' + (maxCount / count) + ')' }}
                                />
                            ))}
                        </div>
                        <Range
                            className="price-range-slider"
                            min={Math.floor(price.minPrice)}
                            max={Math.ceil(price.maxPrice)}
                            allowCross={false}
                            value={[minPrice, maxPrice]}
                            onChange={handleChange}
                            onAfterChange={handleAfterChange}
                        />
                    </> : null}
            </div>
            <div className="price-info-container">
                {"$" + minPrice + " - $" + maxPrice}
            </div>
            <div className="price-info-container">
                The average price is ${avgPrice}
            </div>
        </div>
    );
}

export default PriceFilter;
