import React, { useState } from 'react';
import { getIn } from 'formik';
import { Form, Image } from 'react-bootstrap';
import { getCurrentMonth, getCurrentYear, getNextYears, getMonth } from 'utilities/date';
import { PayPalButton } from 'react-paypal-button-v2';
import * as yup from 'yup';

export const cardFormSchema = yup.object().shape({
    name: yup.string()
        .required("*Name is required")
        .max(255, "*Name can't be longer than 255 characters"),
    cardNumber: yup.string()
        .required("*Card number is required")
        .min(13, "*Card number must have at least 13 characters")
        .max(19, "*Card number can't be longer than 19 characters")
        .test("digits-only", "Card number can only contain digits", value => /^\d*$/.test(value)),
    expirationYear: yup.number()
        .required("*Expiration year is required"),
    expirationMonth: yup.number()
        .required("*Expiration month is required"),
    cvc: yup.number()
        .typeError("*CVC must be a number")
        .required("*CVC is required")
        .min(100, "*CVC must have at least 3 characters")
        .max(9999, "*CVC can't be longer than 4 characters")
});

export const payPalFormSchema = yup.object().shape({
    orderId: yup.string()
        .required("*Finnish the payment checkout with PayPal")
});

export const cardFormInitialValues = (card) => {
    return {
        name: card.name || "",
        cardNumber: card.cardNumber || "",
        expirationYear: card.expirationYear || "",
        expirationMonth: card.expirationMonth || "",
        cvc: card.cvc || ""
    };
};

export const payPalInitialValues = (paypal) => {
    return {
        orderId: paypal.orderId || ""
    };
};

const CardForm = ({ card, payPal: payPalObj, payPalDisabled, cardDisabled, handleChange, touched, errors, price, setPayPal: setPayPalType, setFieldValue }) => {

    const [currentMonth, setCurrentMonth] = useState(0);
    const [payPal, setPayPal] = useState(Object.keys(payPalObj).length !== 0 || false);
    const [creditCard, setCreditCard] = useState(payPalDisabled || Object.keys(card).length !== 0);

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
                    setPayPalType(e.target.checked);
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
                    setPayPalType(!e.target.checked);
                    if (e.target.checked)
                        setPayPal(false);
                }}
                disabled={cardDisabled}
                style={{ marginBottom: 10 }}
            />
            {!creditCard && !payPal ?
                <Form.Control.Feedback className="d-block" type="invalid">
                    *Choose a payment option
            </Form.Control.Feedback> : null}
            {creditCard ?
                <>
                    <Form.Text style={{ textAlign: 'left', paddingLeft: '1.5rem' }} className="form-control-description">
                        We accept the following credit cards.
                        <div style={{ marginTop: 5 }}>
                            <Image style={{ width: 'max(210px, 14vw)' }} src="/images/cards.png" />
                        </div>
                    </Form.Text>

                    <Form.Group style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', marginTop: 30 }}>
                        <Form.Group className="form-half-width">
                            <Form.Label>Name on card</Form.Label>
                            <Form.Control
                                className="form-control-gray-no-shadow"
                                size="xl-18"
                                name="card.name"
                                defaultValue={card.name || ""}
                                placeholder="e.g. Lionel Messi"
                                onChange={handleChange}
                                maxLength={255}
                                isInvalid={getIn(touched, 'card.name') && getIn(errors, 'card.name')}
                            />
                            <Form.Control.Feedback type="invalid">
                                {getIn(errors, 'card.name')}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="form-half-width">
                            <Form.Label>Card number</Form.Label>
                            <Form.Control
                                className="form-control-gray-no-shadow"
                                size="xl-18"
                                name="card.cardNumber"
                                defaultValue={card.cardNumber || ""}
                                placeholder="e.g. 1234 5678 9876 5432"
                                onChange={handleChange}
                                maxLength={19}
                                isInvalid={getIn(touched, 'card.cardNumber') && getIn(errors, 'card.cardNumber')}
                            />
                            <Form.Control.Feedback type="invalid">
                                {getIn(errors, 'card.cardNumber')}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form.Group>

                    <Form.Group style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                        <Form.Group style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'end' }} className="form-half-width">
                            <Form.Group className="form-half-width">
                                <Form.Label style={{ whiteSpace: 'nowrap' }}>Expiration Date</Form.Label>
                                <Form.Control
                                    defaultValue={card.expirationYear || "Year"}
                                    name="card.expirationYear"
                                    onChange={(e) => {
                                        setCurrentMonth(parseInt(e.target.value) === getCurrentYear() ? getCurrentMonth() : 0);
                                        handleChange(e);
                                    }}
                                    size="xl-18"
                                    as="select"
                                    isInvalid={getIn(touched, 'card.expirationYear') && getIn(errors, 'card.expirationYear')}
                                >
                                    <option value="Year" disabled hidden>Year</option>
                                    {getNextYears(10).map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </Form.Control>
                                <Form.Control.Feedback className="inline-feedback-error" type="invalid">
                                    {getIn(errors, 'card.expirationYear')}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="form-half-width">
                                <Form.Control
                                    defaultValue={card.expirationMonth || "Month"}
                                    name="card.expirationMonth"
                                    onChange={handleChange}
                                    size="xl-18"
                                    as="select"
                                    isInvalid={getIn(touched, 'card.expirationMonth') && getIn(errors, 'card.expirationMonth')}
                                >
                                    <option value="Month" disabled hidden>Month</option>
                                    {[...Array(12 - currentMonth).keys()].map(x => (
                                        <option key={x} value={currentMonth + x + 1}>{getMonth(currentMonth + x)}</option>
                                    ))}
                                </Form.Control>
                                <Form.Control.Feedback className="inline-feedback-error" type="invalid">
                                    {getIn(errors, 'card.expirationMonth')}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Form.Group>

                        <Form.Group className="form-half-width">
                            <Form.Label>CVC/CW</Form.Label>
                            <Form.Control
                                className="form-control-gray-no-shadow"
                                size="xl-18"
                                name="card.cvc"
                                defaultValue={card.cvc || ""}
                                placeholder="e.g. 1234"
                                onChange={handleChange}
                                maxLength={4}
                                isInvalid={getIn(touched, 'card.cvc') && getIn(errors, 'card.cvc')}
                            />
                            <Form.Control.Feedback className="inline-feedback-error" type="invalid">
                                {getIn(errors, 'card.cvc')}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form.Group>
                </> : payPal ?
                    <div style={{ textAlign: 'center' }}>
                        <PayPalButton
                            amount={price}
                            shippingPreference="NO_SHIPPING"
                            onSuccess={(_details, data) => {
                                setFieldValue("payPal.orderId", data.orderID);
                            }}
                        />
                    </div>
                    : null}
        </>
    );
}

export default CardForm;
