import React from 'react';
import { Form } from 'react-bootstrap';
import { getDaysArrayInMonth, getDaysInMonth, getMonths, getPastYears } from 'utilities/date';

export const BirthDateForm = ({ handleChange, touched, values, errors, setFieldValue }) => (
    <Form.Group>
        <Form.Label>Date of Birth</Form.Label>
        <div style={{ display: 'flex', width: '70%' }}>
            <Form.Control
                defaultValue={values.month || -1}
                name="month"
                onChange={(e) => {
                    if (getDaysInMonth(parseInt(e.target.value) + 1, values.year) < values.day)
                        setFieldValue("day", "1");
                    handleChange(e);
                }}
                size="lg-18"
                as="select"
                isInvalid={touched.month && errors.month}
                style={{ width: '40%', marginRight: 20 }}
            >
                <option value={-1} disabled hidden>Month</option>
                {getMonths().map((month, i) => (
                    <option key={month} value={i}>{month}</option>
                ))}
            </Form.Control>

            <Form.Control
                defaultValue={values.day || -1}
                name="day"
                onChange={handleChange}
                size="lg-18"
                as="select"
                isInvalid={touched.day && errors.day}
                style={{ width: '20%', marginRight: 20 }}
            >
                <option value={-1} disabled hidden>Day</option>
                {getDaysArrayInMonth(parseInt(values.month) + 1, values.year).map(day => (
                    <option key={day} value={day}>{day}</option>
                ))}
            </Form.Control>

            <Form.Control
                defaultValue={values.year || -1}
                name="year"
                onChange={(e) => {
                    if (getDaysInMonth(parseInt(values.month) + 1, e.target.value) < values.day)
                        setFieldValue("day", "1");
                    handleChange(e);
                }}
                size="lg-18"
                as="select"
                isInvalid={touched.year && errors.year}
                style={{ width: '40%' }}
            >
                <option value={-1} disabled hidden>Year</option>
                {getPastYears(100).map(year => (
                    <option key={year} value={year}>{year}</option>
                ))}
            </Form.Control>
        </div>
        <div style={{ display: 'flex', width: '70%' }}>
            <div style={{ width: '40%', marginRight: 20 }}>
                <Form.Control.Feedback className={touched.month && errors.month ? "d-block" : null} type="invalid">
                    {errors.month}
                </Form.Control.Feedback>
            </div>
            <div style={{ width: '20%', marginRight: 20 }}>
                <Form.Control.Feedback className={touched.day && errors.day ? "d-block" : null} type="invalid">
                    {errors.day}
                </Form.Control.Feedback>
            </div>
            <div style={{ width: '40%' }}>
                <Form.Control.Feedback className={touched.year && errors.year ? "d-block" : null} type="invalid">
                    {errors.year}
                </Form.Control.Feedback>
            </div>
        </div>
    </Form.Group >
)
