import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { registerUser } from 'api/auth';
import { setSession } from 'utilities/localStorage';
import { loginUrl, myAccountUrl } from 'utilities/appUrls';
import * as yup from 'yup';

import './register.css';

const Register = ({ changeLoggedInState, showMessage, setBreadcrumb }) => {
    const history = useHistory();

    const [emailError, setEmailError] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setBreadcrumb("REGISTER", []);
        // eslint-disable-next-line
    }, []);

    const schema = yup.object().shape({
        firstName: yup.string()
            .min(2, "*First name must have at least 2 characters")
            .max(100, "*First name can't be longer than 100 characters")
            .required("*First name is required"),
        lastName: yup.string()
            .min(2, "*Last name must have at least 2 characters")
            .max(100, "*Last name can't be longer than 100 characters")
            .required("*Last name is required"),
        email: yup.string()
            .email("*Email must be valid")
            .max(100, "*Email must be less than 100 characters")
            .required("*Email is required"),
        password: yup.string()
            .min(8, "*Password must have at least 8 characters")
            .required("*Password is required"),
    });

    const handleSubmit = async (user) => {
        setLoading(true);
        try {
            const data = await registerUser(user);
            setSession(data.person, data.token);
            setLoading(false);
            history.push(myAccountUrl);
            changeLoggedInState();
            showMessage("success", "Account created successfully");
        } catch (e) {
            if (e.response.data.status === 409)
                setEmailError(true);
        }
        setLoading(false);
    }

    return (
        <div className="register-container">
            <div className="register-title">
                REGISTER
            </div>
            <Formik
                validationSchema={schema}
                initialValues={{ firstName: "", lastName: "", email: "", password: "" }}
                onSubmit={handleSubmit}
            >
                {({
                    handleSubmit,
                    handleChange,
                    touched,
                    errors,
                }) => (
                        <Form noValidate className="register-form" onSubmit={handleSubmit}>
                            <Form.Group>
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                    className="form-control-gray"
                                    size="xl-18"
                                    type="text"
                                    name="firstName"
                                    onChange={handleChange}
                                    isInvalid={touched.firstName && errors.firstName}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.firstName}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                    className="form-control-gray"
                                    size="xl-18"
                                    type="text"
                                    name="lastName"
                                    onChange={handleChange}
                                    isInvalid={touched.lastName && errors.lastName}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.lastName}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Enter Email</Form.Label>
                                <Form.Control
                                    className="form-control-gray"
                                    size="xl-18"
                                    type="email"
                                    name="email"
                                    onChange={handleChange}
                                    isInvalid={(touched.email && errors.email) || emailError}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.email}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    className="form-control-gray"
                                    size="xl-18"
                                    type="password"
                                    name="password"
                                    onChange={handleChange}
                                    isInvalid={touched.password && errors.password}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.password}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Button disabled={loading} style={{ marginTop: 80 }} block variant="transparent-black" size="xxl" type="submit">
                                REGISTER
                            </Button>

                            <Form.Text className="account-exists-text font-18">
                                Already have an account?
                                <Link className="purple-nav-link nav-link" to={loginUrl}>
                                    Login
                                </Link>
                            </Form.Text>
                        </Form>
                    )}
            </Formik>
        </div>
    );
}

export default Register;
