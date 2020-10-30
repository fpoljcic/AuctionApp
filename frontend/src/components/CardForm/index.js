import React, { useEffect, useRef, useState } from 'react';
import { Formik } from 'formik';
import { Form, Image } from 'react-bootstrap';
import moment, { months } from 'moment';
import { getNextYears } from 'utilities/common';
import * as yup from 'yup';

import './cardForm.css';

const CardForm = ({ card, payPalDisabled, submit, onSubmit }) => {

    const cardFormRef = useRef();

    const [currentMonth, setCurrentMonth] = useState(0);
    const [payPal, setPayPal] = useState(false);
    const [creditCard, setCreditCard] = useState(payPalDisabled);

    const schema = yup.object().shape({
        name: yup.string()
            .required("*Name is required")
            .max(255, "*Name can't be longer than 255 characters"),
        cardNumber: yup.string()
            .required("*Card number is required")
            .max(16, "*Card number can't be longer than 16 characters"),
        expirationYear: yup.number()
            .required("*Expiration year is required"),
        expirationMonth: yup.number()
            .required("*Expiration month is required"),
        cvc: yup.string()
            .required("*CVC is required")
            .min(3, "*CVC must have at least 3 characters")
            .max(4, "*CVC can't be longer than 4 characters")
    });

    useEffect(() => {
        if (submit !== null && cardFormRef.current) {
            cardFormRef.current.handleSubmit()
        }
        // eslint-disable-next-line
    }, [submit])

    return (
        <>
            <Form.Check
                custom
                type="checkbox"
                id="custom-paypal-checkbox"
                label="Pay Pal"
                name="payPal"
                checked={payPal}
                onChange={e => {
                    setPayPal(e.target.checked);
                    if (e.target.checked)
                        setCreditCard(false);
                }}
                disabled={payPalDisabled}
                style={{ marginBottom: 10 }}
            />
            <Form.Check
                custom
                type="checkbox"
                id="custom-credit-card-checkbox"
                label="Credit Card"
                name="creditCard"
                checked={creditCard}
                onChange={e => {
                    if (payPalDisabled) {
                        return;
                    }
                    setCreditCard(e.target.checked);
                    if (e.target.checked)
                        setPayPal(false);
                }}
                style={{ marginBottom: 10 }}
            />
            {!creditCard && !payPal ?
                <Form.Control.Feedback className="d-block" type="invalid">
                    *Choose a payment option
            </Form.Control.Feedback> : null}
            {creditCard ?
                <Formik
                    validationSchema={schema}
                    initialValues={{
                        name: card.name || "",
                        cardNumber: card.cardNumber || "",
                        expirationYear: card.expirationYear || "",
                        expirationMonth: card.expirationMonth || "",
                        cvc: card.cvc || "",
                    }}
                    innerRef={cardFormRef}
                    onSubmit={onSubmit}
                >
                    {({
                        handleChange,
                        touched,
                        errors,
                    }) => (
                            <>
                                <Form.Text style={{ textAlign: 'left', paddingLeft: '1.5rem' }} className="form-control-description">
                                    We accept the following credit cards.
                                    <div style={{ marginTop: 5 }}>
                                        <Image style={{ width: 250 }} src="/images/cards.png" />
                                    </div>
                                </Form.Text>

                                <Form.Group style={{ display: 'flex', justifyContent: 'space-between', marginTop: 30 }}>
                                    <Form.Group className="form-half-width">
                                        <Form.Label>Name on card</Form.Label>
                                        <Form.Control
                                            className="form-control-gray-no-shadow"
                                            size="xl-18"
                                            name="name"
                                            defaultValue={card.name || ""}
                                            placeholder="e.g. Lionel Messi"
                                            onChange={handleChange}
                                            maxLength={255}
                                            isInvalid={touched.name && errors.name}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.name}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group className="form-half-width">
                                        <Form.Label>Card number</Form.Label>
                                        <Form.Control
                                            className="form-control-gray-no-shadow"
                                            size="xl-18"
                                            name="cardNumber"
                                            defaultValue={card.cardNumber || ""}
                                            placeholder="e.g. 1234 5678 9876 5432"
                                            onChange={handleChange}
                                            maxLength={16}
                                            isInvalid={touched.cardNumber && errors.cardNumber}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.cardNumber}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Form.Group>

                                <Form.Group style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Form.Group style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }} className="form-half-width">
                                        <Form.Group className="form-half-width">
                                            <Form.Label>Expiration Date</Form.Label>
                                            <Form.Control
                                                defaultValue={card.expirationYear || "Year"}
                                                name="expirationYear"
                                                onChange={(e) => {
                                                    setCurrentMonth(e.target.value === moment().year().toString() ? moment().month() : 0);
                                                    handleChange(e);
                                                }}
                                                size="xl-18"
                                                as="select"
                                                isInvalid={touched.expirationYear && errors.expirationYear}
                                            >
                                                <option value="Year" disabled hidden>Year</option>
                                                {getNextYears(10).map(year => (
                                                    <option key={year} value={year}>{year}</option>
                                                ))}
                                            </Form.Control>
                                            <Form.Control.Feedback style={{ position: 'absolute' }} type="invalid">
                                                {errors.expirationYear}
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group className="form-half-width">
                                            <Form.Control
                                                defaultValue={card.expirationMonth || "Month"}
                                                name="expirationMonth"
                                                onChange={handleChange}
                                                size="xl-18"
                                                as="select"
                                                isInvalid={touched.expirationMonth && errors.expirationMonth}
                                            >
                                                <option value="Month" disabled hidden>Month</option>
                                                {[...Array(12 - currentMonth).keys()].map(x => (
                                                    <option key={x} value={currentMonth + x + 1}>{months(currentMonth + x)}</option>
                                                ))}
                                            </Form.Control>
                                            <Form.Control.Feedback style={{ position: 'absolute' }} type="invalid">
                                                {errors.expirationMonth}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Form.Group>

                                    <Form.Group className="form-half-width">
                                        <Form.Label>CVC/CW</Form.Label>
                                        <Form.Control
                                            className="form-control-gray-no-shadow"
                                            size="xl-18"
                                            name="cvc"
                                            defaultValue={card.cvc || ""}
                                            placeholder="e.g. 1234"
                                            onChange={handleChange}
                                            maxLength={4}
                                            isInvalid={touched.cvc && errors.cvc}
                                        />
                                        <Form.Control.Feedback style={{ position: 'absolute' }} type="invalid">
                                            {errors.cvc}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Form.Group>
                            </>
                        )}
                </Formik> : payPal ?
                    <div>
                        PayPal button
                    </div>
                    : null}
        </>
    );
}

export default CardForm;
