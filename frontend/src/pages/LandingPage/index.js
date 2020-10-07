import React, { useEffect, useState } from 'react';
import { Button, Image, ListGroup } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { getFeaturedRandomProducts, getNewProducts, getLastProducts } from 'api/product';
import { getRandomSubcategories } from 'api/subcategory';
import { getCategories } from 'api/category';
import { IoIosArrowForward } from "react-icons/io";
import { categoryUrl, allCategoryUrl, subcategoryUrl, productUrl } from "utilities/appUrls";

import './landingPage.css';
import ImageCard from 'components/ImageCard';

const LandingPage = ({ removeBreadcrumb }) => {
  const history = useHistory();

  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [randomSubcategories, setRandomSubcategories] = useState([]);
  const [newAndLastProducts, setNewAndLastProducts] = useState([]);
  const [activePage, setActivePage] = useState(0);

  useEffect(() => {
    removeBreadcrumb();
    const fetchData = async () => {
      try {
        setCategories(await getCategories());
        setFeaturedProducts(await getFeaturedRandomProducts());
        setRandomSubcategories(await getRandomSubcategories());
        const newProducts = await getNewProducts();
        const lastProducts = await getLastProducts();
        setNewAndLastProducts([newProducts, lastProducts]);
      } catch (e) { }
    }

    fetchData();
  }, [removeBreadcrumb])

  return (
    <>
      <div className="landing-page-top-container">
        <ListGroup variant="categories">
          <ListGroup.Item style={{ color: '#8367D8', fontWeight: 'bold', borderBottom: 'none' }}>CATEGORIES</ListGroup.Item>
          {categories.map(category => (
            <ListGroup.Item key={category.name} action onClick={() => history.push(categoryUrl(category))}>{category.name}</ListGroup.Item>
          ))}
          <ListGroup.Item action onClick={() => history.push(allCategoryUrl)}>All Categories</ListGroup.Item>
        </ListGroup>

        {featuredProducts.length !== 0 ?
          <div className="featured-product-container">
            <div className="featured-product-container-inner">
              <h1>
                {featuredProducts[0].name}
              </h1>

              <div className="featured-product-price">
                Start from - ${featuredProducts[0].startPrice}
              </div>

              <div className="featured-product-description">
                {featuredProducts[0].description}
              </div>

              <Button
                style={{ width: 192 }}
                size="xxl"
                variant="transparent-black-shadow"
                onClick={() => history.push(productUrl(featuredProducts[0]))}
              >
                BID NOW
                <IoIosArrowForward style={{ fontSize: 24 }} />
              </Button>
            </div>
            <Image className="featured-product-image" src={featuredProducts[0].url} />
          </div> : null}
      </div>

      <div className="featured-container">
        <h2>
          Featured Collections
      	</h2>
        <div className="gray-line" />
        <div className="featured-items-container">
          {randomSubcategories.map(subcategory => (
            <ImageCard key={subcategory.id} data={subcategory} size="xxl" url={subcategoryUrl(subcategory)} />
          ))}
        </div>
      </div>

      <div className="featured-container">
        <h2>
          Featured Products
      	</h2>
        <div className="gray-line" />
        <div className="featured-items-container">
          {featuredProducts.slice(1).map(product => (
            <ImageCard key={product.id} data={product} size="xl" url={productUrl(product)} />
          ))}
        </div>
      </div>

      <div className="featured-container">
        <div className="tabs-container">
          <div style={activePage === 0 ? { borderBottom: '4px solid #8367D8' } : null} className="custom-tab" onClick={() => setActivePage(0)}>
            New Arrivals
          </div>
          <div style={activePage === 1 ? { borderBottom: '4px solid #8367D8' } : null} className="custom-tab" onClick={() => setActivePage(1)}>
            Last Chance
          </div>
        </div>
        <div className="gray-line" />
        <div className="featured-items-container">
          {newAndLastProducts.length !== 0 ? newAndLastProducts[activePage].map(product => (
            <ImageCard key={product.id} data={product} size="lg" url={productUrl(product)} />
          )) : null}
        </div>
      </div>
    </>
  );
}

export default LandingPage;
