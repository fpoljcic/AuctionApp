import React, { useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { MdClear } from 'react-icons/md';

const activeItemStyle = {
    fontWeight: 'bold',
    backgroundColor: 'var(--lighter-silver)'
};

const SizeFilter = ({ size, filterCount, handleClick }) => {
    const [sizes, setsizes] = useState([]);
    const [activeSize, setActiveSize] = useState(size);

    useEffect(() => {
        if (filterCount.sizes === undefined)
            return;
        setsizes(filterCount.sizes);
    }, [filterCount.sizes])

    const sizeClick = (size) => {
        if (activeSize === size) {
            setActiveSize(undefined);
            handleClick(null);
        } else {
            setActiveSize(size);
            handleClick(size);
        }
    }

    return (
        <ListGroup variant="filter">
            <ListGroup.Item className="filter-list-title">
                FILTER BY SIZE
                {activeSize !== undefined ?
                    <MdClear onClick={() => sizeClick(activeSize)} className="list-clear-icon" />
                    : null}
            </ListGroup.Item>
            {sizes.map(size => (
                <ListGroup.Item
                    key={size.size}
                    action
                    onClick={() => sizeClick(size.size)}
                    style={size.size === activeSize ? activeItemStyle : { color: 'var(--text-primary)' }}
                >
                    {size.size.replace("_", " ") + ' (' + size.count + ')'}
                </ListGroup.Item>
            ))}
        </ListGroup>
    );
}

export default SizeFilter;
