import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Formik, getIn } from 'formik';
import { Form, InputGroup } from 'react-bootstrap';
import SubmitButtons from './SubmitButtons';
import { countries, citiesByCountry, callCodeForCountry, validPhoneNumber } from 'utilities/common';
import CardForm, { cardFormSchema, payPalFormSchema, cardFormInitialValues, payPalInitialValues } from 'components/Forms/CardForm';
import { productUrl } from 'utilities/appUrls';
import * as yup from 'yup';

import './sellerTabs.css';

const SellTab3 = ({ product, setProduct, setActiveTab, onDone }) => {
    const history = useHistory();

    const [country, setCountry] = useState(product.country || null);
    const [callCode, setCallCode] = useState(product.callCode || null);
    const [shipping, setShipping] = useState(product.shipping || false);
    const [featured, setFeatured] = useState(product.featured || false);
    const [payPal, setPayPal] = useState(product.payPal !== undefined);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setCallCode(callCodeForCountry(country));
    }, [country])

    const schema = yup.object().shape({
        street: yup.string()
            .required("*Address is required")
            .max(255, "*Address can't be longer than 255 characters"),
        country: yup.string()
            .required("*Country is required")
            .max(255, "*Country can't be longer than 255 characters"),
        city: yup.string()
            .required("*City is required")
            .max(255, "*City can't be longer than 255 characters"),
        zip: yup.string()
            .required("*Zip is required")
            .max(32, "*Zip can't be longer than 32 characters"),
        phone: yup.string()
            .required("*Phone is required")
            .max(32, "*Phone can't be longer than 32 characters")
            .test("digits-only", "Phone number only contain digits", value => /^\d*$/.test(value))
            .test("country-selected", "*Select a country", () => country !== null)
            .test("valid-phone", "*Phone must be valid", value => validPhoneNumber(value, country, false)),
        shipping: yup.bool(),
        featured: yup.bool(),
        card: !payPal && (shipping || featured) ? cardFormSchema : null,
        payPal: payPal ? payPalFormSchema : null
    });

    const saveValues = (data) => {
        const newData = { ...product, ...data, callCode: callCode };
        if (!data.shipping && !data.featured) {
            delete newData.card;
            delete newData.payPal;
        } else {
            if (data.payPal.orderId !== "")
                delete newData.card;
            else
                delete newData.payPal;
        }
        setProduct(newData);
        return newData;
    }

    const handleSubmit = async (data) => {
        const newData = saveValues(data);
        setLoading(true);
        const newProduct = await onDone(newData);
        if (newProduct === null)
            setLoading(false);
        else
            history.push({
                pathname: productUrl(newProduct),
                state: { newProduct: true }
            })
    }

    const getPrice = 0 + (shipping ? 10 : 0) + (featured ? 5 : 0);

    return (
        <div className="tab-container">
            <div className="tab-title">
                LOCATION &#38; SHIPPING
            </div>
            <div className="tab-content">
                <Formik
                    validationSchema={schema}
                    initialValues={{
                        street: product.street || "",
                        country: product.country || "",
                        city: product.city || "",
                        zip: product.zip || "",
                        phone: product.phone || "",
                        shipping: product.shipping || false,
                        featured: product.featured || false,
                        card: cardFormInitialValues(product.card || {}),
                        payPal: payPalInitialValues(product.payPal || {})
                    }}
                    onSubmit={handleSubmit}
                >
                    {({
                        handleSubmit,
                        handleChange,
                        touched,
                        errors,
                        values,
                        setFieldValue
                    }) => (
                            <Form noValidate onSubmit={handleSubmit}>
                                <Form.Group style={{ marginBottom: 40 }}>
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control
                                        className="form-control-gray-no-shadow"
                                        size="xl-18"
                                        name="street"
                                        defaultValue={product.street || ""}
                                        placeholder="e.g. Obala Kulina bana"
                                        onChange={handleChange}
                                        maxLength={255}
                                        isInvalid={touched.street && errors.street}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.street}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                                    <Form.Group className="form-half-width">
                                        <Form.Control
                                            defaultValue={product.country || "Select Country"}
                                            name="country"
                                            onChange={(e) => {
                                                setCountry(e.target.value);
                                                handleChange(e);
                                            }}
                                            size="xl-18"
                                            as="select"
                                            isInvalid={touched.country && errors.country}
                                        >
                                            <option value="Select Country" disabled hidden>Select Country</option>
                                            {countries.map(country => (
                                                <option key={country} value={country}>{country}</option>
                                            ))}
                                        </Form.Control>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.country}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group className="form-half-width">
                                        <Form.Control
                                            defaultValue={product.city || "Select City"}
                                            name="city"
                                            onChange={handleChange}
                                            size="xl-18"
                                            as="select"
                                            isInvalid={touched.city && errors.city}
                                        >
                                            <option value="Select City" hidden>Select City</option>
                                            {citiesByCountry(country).map(city => (
                                                <option key={city} value={city}>{city}</option>
                                            ))}
                                        </Form.Control>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.city}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Form.Group>

                                <Form.Group className="sell-form-margin">
                                    <Form.Label>Zip Code</Form.Label>
                                    <Form.Control
                                        className="form-control-gray-no-shadow"
                                        size="xl-18"
                                        name="zip"
                                        defaultValue={product.zip || ""}
                                        placeholder="e.g. 71000"
                                        onChange={handleChange}
                                        maxLength={32}
                                        isInvalid={touched.zip && errors.zip}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.zip}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="sell-form-margin">
                                    <Form.Label>Phone</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>{callCode}</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control
                                            className="form-control-gray-no-shadow"
                                            size="xl-18"
                                            name="phone"
                                            defaultValue={product.phone || ""}
                                            placeholder="e.g. 62123456"
                                            onChange={handleChange}
                                            maxLength={32}
                                            isInvalid={touched.phone && errors.phone}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.phone}
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group className="sell-form-margin">
                                    <Form.Check
                                        custom
                                        type="checkbox"
                                        id="custom-shipping-checkbox"
                                        label="Do you want us to bear shipping cost?"
                                        name="shipping"
                                        defaultChecked={product.shipping || false}
                                        onChange={(e) => {
                                            setShipping(e.target.checked);
                                            handleChange(e);
                                        }}
                                    />
                                    <Form.Text style={{ textAlign: 'left', paddingLeft: '1.5rem' }} className="form-control-description">
                                        The average shipping cost is $10.00. You have to provide us payment information.
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group className="sell-form-margin">
                                    <Form.Check
                                        custom
                                        type="checkbox"
                                        id="custom-featured-checkbox"
                                        label="Do you want the product featured on the landing page?"
                                        name="featured"
                                        defaultChecked={product.featured || false}
                                        onChange={(e) => {
                                            setFeatured(e.target.checked);
                                            handleChange(e);
                                        }}
                                    />
                                    <Form.Text style={{ textAlign: 'left', paddingLeft: '1.5rem' }} className="form-control-description">
                                        Featured products cost $5.00 per month. You have to provide us payment information.
                                    </Form.Text>
                                </Form.Group>

                                {shipping || featured ?
                                    <Form.Group className="sell-form-margin">
                                        <Form.Label style={{ fontSize: 20, letterSpacing: 0.7 }}>Payment information</Form.Label>
                                        <div className="gray-line" />
                                        <CardForm
                                            card={product.card || {}}
                                            payPal={product.payPal || {}}
                                            payPalDisabled={false}
                                            cardDisabled={product.payPal !== undefined && product.payPal.orderId !== ""}
                                            handleChange={handleChange}
                                            touched={touched}
                                            errors={errors}
                                            price={getPrice}
                                            setPayPal={setPayPal}
                                            setFieldValue={setFieldValue}
                                        />
                                        <Form.Control.Feedback className={payPal && getIn(errors, 'payPal.orderId') ? "d-block" : null} type="invalid">
                                            {getIn(errors, 'payPal.orderId')}
                                        </Form.Control.Feedback>
                                    </Form.Group> : null}

                                <SubmitButtons
                                    onBack={() => {
                                        saveValues(values);
                                        setActiveTab(1);
                                    }}
                                    lastTab={true}
                                    loading={loading}
                                />
                            </Form>
                        )}
                </Formik>
            </div>
        </div>
    );
}

export default SellTab3;
