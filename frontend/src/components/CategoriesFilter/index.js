import React, { useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { TiPlus, TiMinus } from 'react-icons/ti';
import { searchCountProducts } from 'api/product';

const activeItemStyle = {
    fontWeight: 'bold',
    backgroundColor: 'var(--lighter-silver)'
};

const CategoriesFilter = ({ query, filter, handleClick }) => {
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState("");
    const [activeSubcategory, setActiveSubcategory] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setCategories(await searchCountProducts(query, filter.minPrice, filter.maxPrice, filter.color));
            } catch (e) { }
        }
        fetchData();
    }, [query, filter.minPrice, filter.maxPrice, filter.color])

    useEffect(() => {
        setActiveCategory(filter.category || "");
        setActiveSubcategory(filter.subcategory || "");
    }, [filter])

    const allCategoryClick = () => {
        setActiveCategory("");
        setActiveSubcategory("");
        handleClick({ category: null, subcategory: null });
    }

    const categoryClick = (categoryName) => {
        setActiveSubcategory("");
        if (activeCategory === categoryName) {
            setActiveCategory("");
            handleClick({ category: null, subcategory: null });
        }
        else {
            setActiveCategory(categoryName);
            handleClick({ category: categoryName, subcategory: null });
        }
    }

    const subcategoryClick = (subcategoryName) => {
        setActiveSubcategory(subcategoryName);
        handleClick({ category: activeCategory, subcategory: subcategoryName });
    }

    return (
        <ListGroup variant="filter">
            <ListGroup.Item className="filter-list-title">PRODUCT CATEGORIES</ListGroup.Item>
            <ListGroup.Item
                action
                style={activeCategory === "" && activeSubcategory === "" ? activeItemStyle : { color: 'var(--text-primary)' }}
                onClick={allCategoryClick}
            >
                All Categories
            </ListGroup.Item>
            {categories.map(category => (
                <React.Fragment key={category.name}>
                    <ListGroup.Item
                        action
                        onClick={() => categoryClick(category.name)}
                        style={category.name === activeCategory && activeSubcategory === "" ? activeItemStyle : { color: 'var(--text-primary)' }}
                    >
                        {category.name}
                        {' (' + category.count + ')'}
                        {category.name === activeCategory ?
                            <TiMinus style={{ fontSize: 24, color: 'var(--primary)' }} /> : <TiPlus style={{ fontSize: 24 }} />}
                    </ListGroup.Item>
                    {category.name === activeCategory ? category.subcategories.map(subcategory => (
                        <ListGroup.Item
                            style={category.name === activeCategory && subcategory.name === activeSubcategory ? activeItemStyle : { color: 'var(--text-secondary)' }}
                            key={subcategory.name}
                            action
                            onClick={() => subcategoryClick(subcategory.name)}
                        >
                            {subcategory.name}
                            {' (' + subcategory.count + ')'}
                        </ListGroup.Item>
                    )) : null}
                </React.Fragment>
            ))}
        </ListGroup>
    );
}

export default CategoriesFilter;
