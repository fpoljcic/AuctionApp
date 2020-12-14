import React, { useState } from 'react';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { dateCompare } from 'utilities/date';

import './tables.css';

const SortTh = ({ children, data, setData, name, type, active, setActive, style, desc, colSpan }) => {

    const [order, setOrder] = useState(desc !== true);

    const handleSort = () => {
        setActive(name);
        switch (type) {
            case "string":
                setData([...data].sort((a, b) => order ? a[name].localeCompare(b[name]) : b[name].localeCompare(a[name])));
                break;
            case "date":
                setData([...data].sort((a, b) => dateCompare(a[name], b[name], order)));
                break;
            case "number":
                setData([...data].sort((a, b) => order ? a[name] - b[name] : b[name] - a[name]));
                break;
            default:
                break;
        }
        setOrder(!order);
    }

    const renderSort = () => {
        if (active !== name)
            return <FaSort className="sort-icon" />
        if (order)
            return <FaSortDown style={{ top: 'calc(50% - 10px)' }} className="active-sort-icon" />
        return <FaSortUp style={{ top: 'calc(50% - 4px)' }} className="active-sort-icon" />
    }

    return (
        <th
            colSpan={colSpan || 1}
            style={active === name ? { ...style, backgroundColor: 'var(--white-smoke)' } : { ...style }}
            className="sortable-th"
            onClick={handleSort}
        >
            {children}
            {renderSort()}
        </th>
    );
}

export default SortTh;
