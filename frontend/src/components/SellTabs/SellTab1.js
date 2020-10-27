import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Formik } from 'formik';
import { Form } from 'react-bootstrap';
import { myAccountSellerUrl } from 'utilities/appUrls';
import SubmitButtons from './SubmitButtons';
import * as yup from 'yup';

import './sellerTabs.css';

const SellTab1 = ({ categories: loadedCategories, subcategories: loadedSubcategories, selectCategory, filters, product, setProduct, setActiveTab }) => {
    const history = useHistory();

    const [categories, setCategories] = useState(loadedCategories);
    const [categoryChanged, setCategoryChanged] = useState(false);
    const [subcategories, setSubcategories] = useState(loadedSubcategories);
    const [colors, setColors] = useState(filters.colors);
    const [sizes, setSizes] = useState(filters.sizes);

    const [nameLength, setNameLength] = useState(0);
    const [descriptionLength, setDescriptionLength] = useState(0);

    useEffect(() => {
        setCategories(loadedCategories);
    }, [loadedCategories])

    useEffect(() => {
        setSubcategories(loadedSubcategories);
    }, [loadedSubcategories])

    useEffect(() => {
        setColors(filters.colors);
        setSizes(filters.sizes);
    }, [filters])

    const schema = yup.object().shape({
        name: yup.string()
            .required("*Product name is required")
            .max(60, "*Product name must be less than 60 characters"),
        categoryId: yup.string()
            .notOneOf(["Select Category"], "*Category is required"),
        subcategoryId: yup.string()
            .notOneOf(["Select Subcategory"], "*Subcategory is required")
            .test("category-changed-test", "*Subcategory is required", () => !categoryChanged),
        description: yup.string()
            .max(700, "*Product description must be less than 700 characters"),
    });

    const handleSubmit = (data) => {
        setProduct({ ...product, ...data });
        setActiveTab(1);
    }

    return (
        <div className="tab-container">
            <div className="tab-title">
                DETAIL INFORMATION ABOUT PRODUCT
            </div>
            <div className="tab-content">
                <Formik
                    validationSchema={schema}
                    initialValues={{
                        name: product.name || "",
                        categoryId: product.categoryId || "Select Category",
                        subcategoryId: product.subcategoryId || "Select Subcategory",
                        description: product.description || "",
                        color: product.color || null,
                        size: product.size || null
                    }}
                    onSubmit={handleSubmit}
                >
                    {({
                        handleSubmit,
                        handleChange,
                        touched,
                        errors,
                    }) => (
                            <Form noValidate onSubmit={handleSubmit}>
                                <Form.Group>
                                    <Form.Label>What do you sell?</Form.Label>
                                    <Form.Control
                                        className="form-control-gray-no-shadow"
                                        size="xl-18"
                                        name="name"
                                        defaultValue={product.name || ""}
                                        onChange={e => {
                                            handleChange(e);
                                            setNameLength(e.target.value.length);
                                        }}
                                        maxLength={60}
                                        isInvalid={touched.name && errors.name}
                                    />
                                    <Form.Control.Feedback style={{ position: 'absolute' }} type="invalid">
                                        {errors.name}
                                    </Form.Control.Feedback>
                                    <Form.Text className="form-control-description">2-5 words ({60 - nameLength} characters)</Form.Text>
                                </Form.Group>

                                <Form.Group style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Form.Group className="form-sell-select">
                                        <Form.Control
                                            defaultValue={product.categoryId || "Select Category"}
                                            name="categoryId"
                                            onChange={e => {
                                                selectCategory(e, handleChange);
                                                setCategoryChanged(true);
                                            }}
                                            size="xl-18"
                                            as="select"
                                            isInvalid={touched.categoryId && errors.categoryId}
                                        >
                                            <option value="Select Category" disabled hidden>Select Category</option>
                                            {categories.map(category => (
                                                <option key={category.id} value={category.id}>{category.name}</option>
                                            ))}
                                        </Form.Control>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.categoryId}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group className="form-sell-select">
                                        <Form.Control
                                            defaultValue={product.subcategoryId || "Select Subcategory"}
                                            name="subcategoryId"
                                            onChange={e => {
                                                handleChange(e);
                                                setCategoryChanged(false);
                                            }}
                                            size="xl-18"
                                            as="select"
                                            isInvalid={touched.subcategoryId && errors.subcategoryId}
                                        >
                                            <option value="Select Subcategory" hidden>Select Subcategory</option>
                                            {subcategories.map(subcategory => (
                                                <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
                                            ))}
                                        </Form.Control>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.subcategoryId}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        className="form-control-gray-no-shadow"
                                        size="xl-18"
                                        name="description"
                                        defaultValue={product.description || ""}
                                        onChange={e => {
                                            handleChange(e);
                                            setDescriptionLength(e.target.value.length);
                                        }}
                                        isInvalid={touched.description && errors.description}
                                        maxLength={700}
                                        rows={5}
                                    />
                                    <Form.Control.Feedback style={{ position: 'absolute' }} type="invalid">
                                        {errors.description}
                                    </Form.Control.Feedback>
                                    <Form.Text className="form-control-description">100 words ({700 - descriptionLength} characters)</Form.Text>
                                </Form.Group>

                                <Form.Group style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Form.Group className="form-sell-select">
                                        <Form.Control
                                            defaultValue={product.color || "Select Color"}
                                            name="color"
                                            onChange={handleChange}
                                            size="xl-18"
                                            as="select"
                                        >
                                            <option value="Select Color" disabled hidden>Select Color</option>
                                            {colors.map(color => (
                                                <option key={color} value={color}>{color}</option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>

                                    <Form.Group className="form-sell-select">
                                        <Form.Control
                                            defaultValue={product.size || "Select Size"}
                                            name="size"
                                            onChange={handleChange}
                                            size="xl-18"
                                            as="select"
                                        >
                                            <option value="Select Size" disabled hidden>Select Size</option>
                                            {sizes.map(size => (
                                                <option key={size} value={size}>{size.replace("_", " ")}</option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                </Form.Group>

                                <SubmitButtons onBack={() => history.push(myAccountSellerUrl)} />
                            </Form>
                        )}
                </Formik>
            </div>
        </div>
    );
}

export default SellTab1;
