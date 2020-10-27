import React, { useState } from 'react';
import { Formik } from 'formik';
import { Form, InputGroup } from 'react-bootstrap';
import SubmitButtons from './SubmitButtons';
import ReactDatePicker from 'react-datepicker';
import moment from 'moment';
import * as yup from 'yup';

import './sellerTabs.css';

const SellTab2 = ({ product, setProduct, setActiveTab }) => {

    const [startDate, setStartDate] = useState(product.startDate || null);
    const [endDate, setEndDate] = useState(product.endDate || null);

    const schema = yup.object().shape({
        startPrice: yup.number()
            .typeError("*Start price must be a number")
            .required("*Start price is required")
            .min(0.01, "*Start price can't be lower than $0.01")
            .max(999999.99, "*Start price can't be higher than $999999.99"),
        startDate: yup.string()
            .test("valid-date", "*Start date is required", () => startDate !== null),
        endDate: yup.string()
            .test("valid-date", "*End date is required", () => endDate !== null)
    });

    const handleSubmit = (data) => {
        data.startDate = startDate;
        data.endDate = endDate;
        setProduct({ ...product, ...data });
        setActiveTab(2);
    }

    return (
        <div className="tab-container">
            <div className="tab-title">
                SET PRICES
            </div>
            <div className="tab-content">
                <Formik
                    validationSchema={schema}
                    initialValues={{
                        startPrice: product.startPrice || "",
                        startDate: product.startDate || "",
                        endDate: product.endDate || ""
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
                                <Form.Group style={{ marginBottom: 40 }}>
                                    <Form.Label>Your start price</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>$</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control
                                            className="form-control-gray-no-shadow"
                                            size="xl-18"
                                            name="startPrice"
                                            defaultValue={product.startPrice || ""}
                                            onChange={handleChange}
                                            maxLength={9}
                                            isInvalid={touched.startPrice && errors.startPrice}
                                        />
                                    </InputGroup>
                                    <Form.Control.Feedback className="d-block" type="invalid">
                                        {errors.startPrice}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 0 }}>
                                    <Form.Group className="form-sell-select">
                                        <Form.Label>Start date</Form.Label>
                                        <div>
                                            <ReactDatePicker
                                                className="form-control form-control-xl-18 form-control-gray-no-shadow"
                                                placeholderText="DD/MM/YYYY"
                                                dateFormat="dd/MM/yyyy"
                                                name="startDate"
                                                minDate={new Date()}
                                                selected={startDate}
                                                onChange={date => {
                                                    if (date !== null && endDate !== null) {
                                                        if (!moment(endDate).isAfter(date))
                                                            setEndDate(moment(date).add(1, 'day').toDate());
                                                    }
                                                    setStartDate(date);
                                                }}
                                                useWeekdaysShort={true}
                                            />
                                        </div>
                                        <Form.Control.Feedback className="d-block" type="invalid">
                                            {errors.startDate}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group className="form-sell-select">
                                        <Form.Label>End date</Form.Label>
                                        <div>
                                            <ReactDatePicker
                                                className="form-control form-control-xl-18 form-control-gray-no-shadow"
                                                placeholderText="DD/MM/YYYY"
                                                dateFormat="dd/MM/yyyy"
                                                name="endDate"
                                                minDate={startDate !== null ? moment(startDate).add(1, 'day').toDate() : moment().add(1, 'day').toDate()}
                                                selected={endDate}
                                                onChange={date => setEndDate(date)}
                                                useWeekdaysShort={true}
                                            />
                                        </div>
                                        <Form.Control.Feedback className="d-block" type="invalid">
                                            {errors.endDate}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Form.Group>
                                <Form.Text style={{ textAlign: 'left', marginBottom: 80 }} className="form-control-description">
                                    The auction will be automatically closed when the time comes. The highest bid will win the auction.
                                </Form.Text>
                                <SubmitButtons onBack={() => setActiveTab(0)} />
                            </Form>
                        )}
                </Formik>
            </div>
        </div>
    );
}

export default SellTab2;
