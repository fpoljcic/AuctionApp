import React, { useEffect, useState } from 'react';
import { Button, Image, ListGroup } from 'react-bootstrap';
import { getCategories, getFeaturedRandomProducts } from 'utilities/ServerCalls';
import { IoIosArrowForward } from "react-icons/io";

import './landingPage.css';

const LandingPage = () => {

  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setCategories(await getCategories());
      setFeaturedProducts(await getFeaturedRandomProducts());
    }
    
    fetchData();
  }, [])

  return (
    <div className="landing-page-top-container">
      <ListGroup variant="categories">
        <ListGroup.Item style={{ color: '#8367D8', fontWeight: 'bold', borderBottom: 'none' }}>CATEGORIES</ListGroup.Item>
        {categories.map(category => (
          <ListGroup.Item key={category.name} action>{category.name}</ListGroup.Item>
        ))}
        <ListGroup.Item action>All Categories</ListGroup.Item>
      </ListGroup>
      {featuredProducts !== null ?
        <div className="featured-product-container">
          <div className="featured-product-container-inner">
            <div className="featured-product-title">
              {featuredProducts[0].name}
            </div>

            <div className="featured-product-price">
              Star from - ${featuredProducts[0].startPrice}
            </div>

            <div className="featured-product-description">
              {featuredProducts[0].description}
            </div>

            <Button style={{ width: 192 }} size="xxl" variant="transparent-black-shadow">
              BID NOW
              <IoIosArrowForward style={{ fontSize: 24 }} />
            </Button>
          </div>
          <Image width="484px" height="294px" src={featuredProducts[0].url} />
        </div> : null}
    </div>
  );
}

export default LandingPage;
