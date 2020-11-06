import React, { useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { MdClear } from 'react-icons/md';

const activeItemStyle = {
    fontWeight: 'bold',
    backgroundColor: 'var(--lighter-silver)'
};

const ColorFilter = ({ color, filterCount, handleClick }) => {
    const [colors, setColors] = useState([]);
    const [activeColor, setActiveColor] = useState(color);

    useEffect(() => {
        setActiveColor(color);
    }, [color])

    useEffect(() => {
        if (filterCount.colors === undefined)
            return;
        setColors(filterCount.colors);
    }, [filterCount.colors])

    const colorClick = (color) => {
        if (activeColor === color) {
            setActiveColor(undefined);
            handleClick(null);
        } else {
            setActiveColor(color);
            handleClick(color);
        }
    }

    return (
        <ListGroup variant="filter">
            <ListGroup.Item className="filter-list-title">
                FILTER BY COLOR
                {activeColor !== undefined ?
                    <MdClear onClick={() => colorClick(activeColor)} className="list-clear-icon" />
                    : null}
            </ListGroup.Item>
            {colors.map(color => (
                <ListGroup.Item
                    key={color.color}
                    action
                    onClick={() => colorClick(color.color)}
                    style={color.color === activeColor ? activeItemStyle : { color: 'var(--text-primary)' }}
                >
                    {color.color + ' (' + color.count + ')'}
                </ListGroup.Item>
            ))}
        </ListGroup>
    );
}

export default ColorFilter;
