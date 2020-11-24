import React, { useEffect, useState } from 'react';
import { getIn } from 'formik';
import { Form, Image } from 'react-bootstrap';
import { getCurrentMonth, getCurrentYear, getNextYears, getMonth } from 'utilities/date';
import { PayPalButton } from 'react-paypal-button-v2';
import { MdClear } from 'react-icons/md';
import * as yup from 'yup';

export const cardFormSchema = (notRequired, initialCardNumber) => {
    return yup.object().shape({
        name: yup.string()
            .test("custom-required", "*Name is required", value => notRequired || value)
            .max(255, "*Name can't be longer than 255 characters"),
        cardNumber: yup.string()
            .test("custom-required", "*Card number is required", value => notRequired || value)
            .min(13, "*Card number must have at least 13 characters")
            .max(19, "*Card number can't be longer than 19 characters")
            .test("digits-only", "*Card number can only contain digits", value => notRequired || value === initialCardNumber || /^\d*$/.test(value)),
        expirationYear: yup.number()
            .test("custom-required", "*Expiration year is required", value => notRequired || value),
        expirationMonth: yup.number()
            .test("custom-required", "*Expiration month is required", value => notRequired || value),
        cvc: yup.number()
            .typeError("*CVC must be a number")
            .test("custom-required", "*CVC is required", value => notRequired || value)
            .min(100, "*CVC must have at least 3 characters")
            .max(9999, "*CVC can't be longer than 4 characters")
    });
};

export const payPalFormSchema = yup.object().shape({
    orderId: yup.string()
        .required("*Finish the payment checkout with PayPal")
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
    const [payPal, setPayPal] = useState(payPalObj !== undefined ? (Object.keys(payPalObj).length !== 0 || false) : false);
    const [creditCard, setCreditCard] = useState(payPalDisabled || Object.keys(card).length !== 0);
    const [expirationYear, setExpirationYear] = useState(card.expirationYear || "Year");
    const [expirationMonth, setExpirationMonth] = useState(card.expirationMonth || "Month");

    useEffect(() => {
        if (Object.keys(card).length === 0)
            return;
        setFieldValue("card.name", card.name);
        setFieldValue("card.cardNumber", card.cardNumber);
        setFieldValue("card.expirationYear", card.expirationYear);
        setFieldValue("card.expirationMonth", card.expirationMonth);
        setFieldValue("card.cvc", card.cvc);

        setExpirationYear(card.expirationYear);
        setExpirationMonth(card.expirationMonth);
    }, [card, setFieldValue])

    return (
        <>
            {!payPalDisabled ? (
                <>
                    <Form.Check
                        custom
                        type="checkbox"
                        id="custom-paypal-checkbox"
                        label="PayPal"
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
                </>
            ) : null}
            {!creditCard && !payPal ?
                <Form.Control.Feedback className="d-block" type="invalid">
                    *Choose a payment option
            </Form.Control.Feedback> : null}
            {creditCard ?
                <>
                    <Form.Text style={!payPalDisabled ? { textAlign: 'left', paddingLeft: '1.5rem' } : { textAlign: 'left' }} className="form-control-description">
                        We accept the following credit cards
                        <div style={{ marginTop: 5 }}>
                            <Image style={{ width: 'max(210px, 14vw)' }} src="/images/cards.png" />
                        </div>
                    </Form.Text>

                    <Form.Group style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', marginTop: 30 }}>
                        <Form.Group className="form-half-width">
                            <Form.Label>Name on Card</Form.Label>
                            <Form.Control
                                className="form-control-gray-no-shadow"
                                size="xl-18"
                                name="card.name"
                                defaultValue={card.name || ""}
                                placeholder="e.g. Lionel Messi"
                                onChange={handleChange}
                                onBlur={e => e.target.value === "" ? setFieldValue("card.name", "") : null}
                                maxLength={255}
                                isInvalid={getIn(touched, 'card.name') && getIn(errors, 'card.name')}
                            />
                            <Form.Control.Feedback type="invalid">
                                {getIn(errors, 'card.name')}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="form-half-width">
                            <Form.Label>Card Number</Form.Label>
                            <Form.Control
                                className="form-control-gray-no-shadow"
                                size="xl-18"
                                name="card.cardNumber"
                                defaultValue={card.cardNumber || ""}
                                placeholder="e.g. 1234 5678 9876 5432"
                                onChange={handleChange}
                                onBlur={e => e.target.value === "" ? setFieldValue("card.cardNumber", "") : null}
                                maxLength={19}
                                isInvalid={getIn(touched, 'card.cardNumber') && getIn(errors, 'card.cardNumber')}
                            />
                            <Form.Control.Feedback type="invalid">
                                {getIn(errors, 'card.cardNumber')}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form.Group>

                    <Form.Group style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                        <Form.Group style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'flex-end' }} className="form-half-width">
                            <Form.Label style={{ width: '100%' }}>Expiration Date</Form.Label>
                            <Form.Group className="form-half-width">
                                <Form.Control
                                    value={expirationYear}
                                    name="card.expirationYear"
                                    onChange={e => {
                                        setCurrentMonth(parseInt(e.target.value) === getCurrentYear() ? getCurrentMonth() : 0);
                                        handleChange(e);
                                        setExpirationYear(e.target.value);
                                    }}
                                    size="xl-18"
                                    as="select"
                                    isInvalid={getIn(touched, 'card.expirationYear') && getIn(errors, 'card.expirationYear')}
                                    style={expirationYear !== "Year" ? { paddingRight: 66 } : null}
                                >
                                    <option value="Year" disabled hidden>Year</option>
                                    {getNextYears(10).map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </Form.Control>
                                {expirationYear !== "Year" ?
                                    <MdClear
                                        onClick={() => {
                                            setFieldValue("card.expirationYear", "");
                                            setExpirationYear("Year");
                                        }}
                                        className="select-clear"
                                    /> : null}
                                <Form.Control.Feedback className="inline-feedback-error" type="invalid">
                                    {getIn(errors, 'card.expirationYear')}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="form-half-width">
                                <Form.Control
                                    value={expirationMonth}
                                    name="card.expirationMonth"
                                    onChange={e => {
                                        handleChange(e);
                                        setExpirationMonth(e.target.value);
                                    }}
                                    size="xl-18"
                                    as="select"
                                    isInvalid={getIn(touched, 'card.expirationMonth') && getIn(errors, 'card.expirationMonth')}
                                    style={expirationMonth !== "Month" ? { paddingRight: 66 } : null}
                                >
                                    <option value="Month" disabled hidden>Month</option>
                                    {[...Array(12 - currentMonth).keys()].map(x => (
                                        <option key={x} value={currentMonth + x + 1}>{getMonth(currentMonth + x)}</option>
                                    ))}
                                </Form.Control>
                                {expirationMonth !== "Month" ?
                                    <MdClear
                                        onClick={() => {
                                            setFieldValue("card.expirationMonth", "");
                                            setExpirationMonth("Month");
                                        }}
                                        className="select-clear"
                                    /> : null}
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
                                onBlur={e => e.target.value === "" ? setFieldValue("card.cvc", "") : null}
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
