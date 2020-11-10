import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import { useBreadcrumbContext } from 'AppContext';
import { Formik } from 'formik';
import { forgotPasswordUrl, loginUrl } from 'utilities/appUrls';
import { resetPassword, validResetToken } from 'api/auth';
import * as qs from 'query-string';
import * as yup from 'yup';

const ResetPassword = () => {
    const { setBreadcrumb } = useBreadcrumbContext();

    const history = useHistory();
    const urlParams = qs.parse(history.location.search);

    const [loading, setLoading] = useState(false);
    const [validToken, setValidToken] = useState(false);

    useEffect(() => {
        setBreadcrumb("RESET PASSWORD", []);
        const fetchData = async () => {
            try {
                setValidToken(await validResetToken(urlParams.token));
            } catch (e) {
            }
        }
        fetchData();
        // eslint-disable-next-line
    }, [])

    const schema = yup.object().shape({
        password: yup.string()
            .required("*Password is required")
            .min(8, "*Password must have at least 8 characters")
            .max(255, "*Password can't be longer than 255 characters"),
        confirmPassword: yup.string()
            .required("*Confirm your password")
            .oneOf([yup.ref("password")], "*Passwords must match")
            .min(8, "*Password must have at least 8 characters")
            .max(255, "*Password can't be longer than 255 characters"),
    });

    const handleSubmit = async (data) => {
        setLoading(true);
        try {
            const message = await resetPassword(urlParams.token, data.password);
            setLoading(false);
            history.push({
                pathname: loginUrl,
                state: { message }
            });
        } catch (e) {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="tab-container">
                <div className="tab-title">
                    RESET PASSWORD
                </div>
                <div className="tab-content">
                    {validToken ?
                        <Formik
                            validationSchema={schema}
                            initialValues={{ password: "", confirmPassword: "" }}
                            onSubmit={handleSubmit}
                        >
                            {({
                                handleSubmit,
                                handleChange,
                                touched,
                                errors,
                            }) => (
                                    <Form noValidate onSubmit={handleSubmit}>
                                        <Form.Text style={{ textAlign: 'left', color: 'var(--text-secondary)', margin: '20px 0' }} className="font-18">
                                            Enter a new password below.
                                        </Form.Text>

                                        <Form.Group style={{ marginTop: 40 }}>
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control
                                                className="form-control-gray"
                                                size="xl-18"
                                                type="password"
                                                name="password"
                                                maxLength={255}
                                                defaultValue=""
                                                onChange={handleChange}
                                                isInvalid={touched.password && errors.password}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.password}
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group style={{ marginTop: 20 }}>
                                            <Form.Label>Confirm Password</Form.Label>
                                            <Form.Control
                                                className="form-control-gray"
                                                size="xl-18"
                                                type="password"
                                                name="confirmPassword"
                                                maxLength={255}
                                                defaultValue=""
                                                onChange={handleChange}
                                                isInvalid={touched.confirmPassword && errors.confirmPassword}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.confirmPassword}
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Button
                                            size="xxl"
                                            style={{ margin: '60px 0' }}
                                            block
                                            disabled={loading}
                                            type="submit"
                                            variant="transparent-black-shadow"
                                        >
                                            SUBMIT
                                        </Button>
                                    </Form>
                                )}
                        </Formik> :
                        <>
                            <Form.Group>
                                <Form.Label style={{ fontWeight: 'bold' }}>Unable to reset password</Form.Label>
                                <Button
                                    size="xxl"
                                    style={{ marginTop: 10, marginBottom: 5 }}
                                    block
                                    variant="transparent-black-shadow"
                                    onClick={() => history.push(forgotPasswordUrl)}
                                >
                                    RESET PASSWORD
                                </Button>
                                <Form.Text style={{ textAlign: 'left' }} className="form-control-description">
                                    The reset link is invalid or expired. Try requesting a new one.
                                </Form.Text>
                            </Form.Group>
                        </>
                    }
                </div>
            </div>
        </>
    );
}

export default ResetPassword;
