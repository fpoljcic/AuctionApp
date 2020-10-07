import React, { useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { TiPlus, TiMinus } from 'react-icons/ti';

import './categoriesFilter.css';

const activeItemStyle = {
    fontWeight: 'bold',
    backgroundColor: '#ECECEC'
};

const CategoriesFilter = ({ products, setFilter }) => {

    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState("");
    const [activeSubcategory, setActiveSubcategory] = useState("");

    useEffect(() => {
        let filterMap = new Map();
        for (let i = 0; i < products.length; i++) {
            const categoryMap = filterMap.get(products[i].categoryName);
            if (categoryMap !== undefined) {
                const subcategoryCount = categoryMap.sc.get(products[i].subcategoryName);
                if (subcategoryCount === undefined)
                    categoryMap.sc.set(products[i].subcategoryName, 1);
                else
                    categoryMap.sc.set(products[i].subcategoryName, subcategoryCount + 1);
                categoryMap.count++;
            } else
                filterMap.set(products[i].categoryName, { count: 1, sc: new Map([[products[i].subcategoryName, 1]]) });
        }
        const data = [...filterMap].map(([name, obj]) => (
            {
                name,
                count: obj.count,
                subcategories: [...obj.sc].map(([name, count]) => (
                    { name, count }
                ))
            }
        )).sort((a, b) => b.count - a.count);
        setCategories(data);
    }, [products]);

    const allCategoryClick = () => {
        setActiveCategory("");
        setActiveSubcategory("");
        setFilter({ category: null, subcategory: null });
    }

    const categoryClick = (categoryName) => {
        setActiveSubcategory("");
        if (activeCategory === categoryName) {
            setActiveCategory("");
            setFilter({ category: null, subcategory: null });
        }
        else {
            setActiveCategory(categoryName);
            setFilter({ category: categoryName, subcategory: null });
        }
    }

    const subcategoryClick = (subcategoryName) => {
        setActiveSubcategory(subcategoryName);
        setFilter({ category: activeCategory, subcategory: subcategoryName });
    }

    return (
        <ListGroup variant="categories-filter">
            <ListGroup.Item className="categories-filter-title">PRODUCT CATEGORIES</ListGroup.Item>
            <ListGroup.Item
                action
                style={activeCategory === "" && activeSubcategory === "" ? activeItemStyle : { color: '#252525' }}
                onClick={allCategoryClick}
            >
                All Categories
            </ListGroup.Item>
            {categories.map(category => (
                <React.Fragment key={category.name}>
                    <ListGroup.Item
                        action
                        onClick={() => categoryClick(category.name)}
                        style={category.name === activeCategory && activeSubcategory === "" ? activeItemStyle : { color: '#252525' }}
                    >
                        {category.name}
                        {category.name === activeCategory ?
                            <TiMinus style={{ fontSize: 24, color: '#8367D8' }} /> : <TiPlus style={{ fontSize: 24 }} />}
                    </ListGroup.Item>
                    {category.name === activeCategory ? category.subcategories.map(subcategory => (
                        <ListGroup.Item
                            style={category.name === activeCategory && subcategory.name === activeSubcategory ? activeItemStyle : { color: '#9B9B9B' }}
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