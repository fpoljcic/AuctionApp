import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { setSession, setRememberInfo, getRememberInfo, removeRememberInfo } from 'utilities/localStorage';
import { SiFacebook, SiGmail } from 'react-icons/si';
import { loginUser } from 'api/auth';
import { forgotPasswordUrl } from 'utilities/appUrls';
import { useBreadcrumbContext, useUserContext } from 'AppContext';
import * as yup from 'yup';

import './login.css';

const Login = () => {
    const { setBreadcrumb } = useBreadcrumbContext();
    const { setLoggedIn } = useUserContext();
    const history = useHistory();

    const rememberInfo = getRememberInfo();

    const [loginError, setLoginError] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setBreadcrumb("LOGIN", []);
        // eslint-disable-next-line
    }, [])

    const handleSubmit = async (user) => {
        setLoading(true);
        try {
            const data = await loginUser(user);
            setSession(data.person, data.token);
            if (user.remember)
                setRememberInfo(user.email, user.password);
            else
                removeRememberInfo();
            setLoading(false);
            history.goBack();
            setLoggedIn(true);
        } catch (e) {
            setLoginError(true);
            setLoading(false);
        }
    }

    const schema = yup.object().shape({
        email: yup.string()
            .email("*Email must be valid")
            .max(100, "*Email can't be longer than 100 characters")
            .required("*Email is required"),
        password: yup.string()
            .required("*Password is required")
            .max(255, "*Password can't be longer than 100 characters"),
        remember: yup.bool()
    });

    return (
        <div className="login-container">
            <div className="login-title">
                LOGIN
            </div>
            <Formik
                validationSchema={schema}
                initialValues={{ email: rememberInfo.email || "", password: rememberInfo.password || "", remember: rememberInfo.email !== null }}
                onSubmit={handleSubmit}
            >
                {({
                    handleSubmit,
                    handleChange,
                    touched,
                    errors,
                }) => (
                        <Form noValidate className="login-form" onSubmit={handleSubmit}>
                            <Form.Group>
                                <Form.Label>Enter Email</Form.Label>
                                <Form.Control
                                    className="form-control-gray"
                                    size="xl-18"
                                    type="email"
                                    name="email"
                                    maxLength={100}
                                    defaultValue={rememberInfo.email || ""}
                                    onChange={handleChange}
                                    isInvalid={(touched.email && errors.email) || loginError}
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
                                    maxLength={255}
                                    defaultValue={rememberInfo.password || ""}
                                    onChange={handleChange}
                                    isInvalid={(touched.password && errors.password) || loginError}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.password}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Check
                                custom
                                type="checkbox"
                                id="custom-checkbox"
                                label="Remember me"
                                name="remember"
                                defaultChecked={rememberInfo.email !== null}
                                onChange={handleChange}
                            />

                            <Button disabled={loading} block variant="fill-purple-shadow" size="xxl" type="submit">
                                LOGIN
                            </Button>

                            <Form.Row>
                                <Button variant="fb-button">
                                    <SiFacebook style={{ fontSize: 25, marginRight: 10 }} />
                                    LOGIN WITH FACEBOOK
                                </Button>
                                <Button variant="google-button">
                                    <SiGmail style={{ fontSize: 25, marginRight: 10 }} />
                                    LOGIN WITH GMAIL
                                </Button>
                            </Form.Row>

                            <Form.Text className="font-18">
                                <Link className="purple-nav-link nav-link" to={forgotPasswordUrl}>
                                    Forgot password?
                                </Link>
                            </Form.Text>
                        </Form>
                    )}
            </Formik>
        </div>
    );
}

export default Login;
