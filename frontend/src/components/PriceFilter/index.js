import React, { useEffect, useState } from 'react';
import { Range } from 'rc-slider';
import { MdClear } from 'react-icons/md';

import './priceFilter.css';

const PriceFilter = ({ minPrice: minPriceSearch, maxPrice: maxPriceSearch, filterCount, handleClick }) => {
    const [price, setPrice] = useState(null);
    const [minPrice, setMinPrice] = useState(minPriceSearch || 0);
    const [maxPrice, setMaxPrice] = useState(maxPriceSearch || 0);
    const [avgPrice, setAvgPrice] = useState(0);
    const [maxCount, setMaxCount] = useState(0);
    const [active, setActive] = useState(false);

    useEffect(() => {
        if (filterCount.price === undefined)
            return;
        setPrice(filterCount.price);
        setMinPrice(minPriceSearch === undefined || minPriceSearch === null ? Math.floor(filterCount.price.minPrice) : minPriceSearch);
        setMaxPrice(maxPriceSearch === undefined || maxPriceSearch === null ? Math.ceil(filterCount.price.maxPrice) : maxPriceSearch);
        setActive((minPriceSearch !== undefined && minPriceSearch !== null) || (maxPriceSearch !== undefined && maxPriceSearch !== null));
        setAvgPrice(filterCount.price.avgPrice);
        setMaxCount(Math.max.apply(0, filterCount.price.prices));
        // eslint-disable-next-line
    }, [filterCount.price])

    const handleChange = (price) => {
        setMinPrice(price[0]);
        setMaxPrice(price[1]);
    }

    const handleAfterChange = (price) => {
        setActive(true);
        handleClick({ minPrice: price[0], maxPrice: price[1] });
    }

    const clearPrice = () => {
        setActive(false);
        handleClick({ minPrice: null, maxPrice: null });
        setMinPrice(Math.floor(price.minPrice));
        setMaxPrice(Math.floor(price.maxPrice));
    }

    return (
        <div className="price-filter-container">
            <div className="price-filter-title">
                FILTER BY PRICE
                {active ?
                    <MdClear onClick={clearPrice} className="list-clear-icon" />
                    : null}
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
