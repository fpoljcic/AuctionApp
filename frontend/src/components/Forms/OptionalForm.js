import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { MdClear } from 'react-icons/md';
import { countries, citiesByCountry } from 'utilities/common';
import * as yup from 'yup';

export const optionalFormSchema = {
    street: yup.string()
        .max(255, "*Address can't be longer than 255 characters"),
    country: yup.string()
        .max(255, "*Country can't be longer than 255 characters"),
    city: yup.string()
        .max(255, "*City can't be longer than 255 characters"),
    state: yup.string()
        .max(255, "*State can't be longer than 255 characters"),
    zip: yup.string()
        .max(32, "*Zip can't be longer than 32 characters"),
};

export const optionalFormInitialValues = (user) => {
    return {
        street: user.street || "",
        country: user.country || "",
        city: user.city || "",
        state: user.state || "",
        zip: user.zip || "",
    };
};

const OptionalForm = ({ handleChange, touched, errors, values, setFieldValue }) => {

    const [country, setCountry] = useState(values.country || "Select Country");
    const [city, setCity] = useState(values.city || "Select City");

    return (
        <>
            <Form.Label style={{ textAlign: 'left', fontSize: 28, letterSpacing: 0.98 }}>Address</Form.Label>
            <Form.Group>
                <Form.Label>Street</Form.Label>
                <Form.Control
                    className="form-control-gray-no-shadow"
                    size="lg-18"
                    name="street"
                    defaultValue={values.street || ""}
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
                <Form.Group style={{ marginBottom: 0 }} className="form-half-width">
                    <Form.Label>Country</Form.Label>
                    <Form.Control
                        value={country}
                        name="country"
                        onChange={(e) => {
                            setCountry(e.target.value);
                            setFieldValue("city", "");
                            handleChange(e);
                        }}
                        size="lg-18"
                        as="select"
                        isInvalid={touched.country && errors.country}
                        style={country !== "Select Country" ? { paddingRight: 66 } : null}
                    >
                        <option value="Select Country" disabled hidden>Select Country</option>
                        {countries.map(country => (
                            <option key={country} value={country}>{country}</option>
                        ))}
                    </Form.Control>
                    {country !== "Select Country" ?
                        <MdClear
                            onClick={() => {
                                setFieldValue("country", "");
                                setCountry("Select Country");
                                setFieldValue("city", "");
                                setCity("Select City");
                            }}
                            className="select-clear"
                            style={{ top: 'unset', bottom: 8 }}
                        /> : null}
                    <Form.Control.Feedback type="invalid">
                        {errors.country}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group style={{ marginBottom: 0 }} className="form-half-width">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                        value={city}
                        name="city"
                        onChange={e => {
                            setCity(e.target.value);
                            handleChange(e);
                        }}
                        size="lg-18"
                        as="select"
                        isInvalid={touched.city && errors.city}
                        style={city !== "Select City" ? { paddingRight: 66 } : null}
                    >
                        <option value="Select City" hidden>Select City</option>
                        {citiesByCountry(country).map(city => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </Form.Control>
                    {city !== "Select City" ?
                        <MdClear
                            onClick={() => {
                                setFieldValue("city", "");
                                setCity("Select City");
                            }}
                            className="select-clear"
                            style={{ top: 'unset', bottom: 8 }}
                        /> : null}
                    <Form.Control.Feedback type="invalid">
                        {errors.city}
                    </Form.Control.Feedback>
                </Form.Group>
            </Form.Group>

            <Form.Group>
                <Form.Label>State</Form.Label>
                <Form.Control
                    className="form-control-gray-no-shadow"
                    size="lg-18"
                    name="state"
                    defaultValue={values.state || ""}
                    placeholder="e.g. California"
                    onChange={handleChange}
                    maxLength={255}
                    isInvalid={touched.state && errors.state}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.state}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
                <Form.Label>Zip Code</Form.Label>
                <Form.Control
                    className="form-control-gray-no-shadow"
                    size="lg-18"
                    name="zip"
                    defaultValue={values.zip || ""}
                    placeholder="e.g. 71000"
                    onChange={handleChange}
                    maxLength={32}
                    isInvalid={touched.zip && errors.zip}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.zip}
                </Form.Control.Feedback>
            </Form.Group>
        </>
    );
}

export default OptionalForm;
