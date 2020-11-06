import React, { useEffect, useRef, useState } from 'react';
import { Formik } from 'formik';
import RequiredForm, { requiredFormInitialValues, requiredFormSchema } from 'components/Forms/RequiredForm';
import { getUser } from 'utilities/localStorage';
import { Button, Form, Image } from 'react-bootstrap';
import { IoIosArrowForward } from 'react-icons/io';
import { toBase64 } from 'utilities/common';
import { getCard } from 'api/card';
import CardForm, { cardFormInitialValues, cardFormSchema } from 'components/Forms/CardForm';
import * as yup from 'yup';

import './myAccountTabs.css';

const Profile = () => {

    const user = getUser();
    const inputFile = useRef(null);

    const [imageSrc, setImageSrc] = useState(user.photo);
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [card, setCard] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            setCard(await getCard());
        }
        fetchData();
    }, [])

    const schema = yup.object().shape({
        ...requiredFormSchema,
        card: cardFormSchema(card.cardNumber)
    });

    const handleSubmit = async (data) => {
        console.log(data)
    }

    const uploadFile = async (e) => {
        const file = e.target.files[0];
        const imageType = /^image\/.*$/;
        if (imageType.test(file.type)) {
            setLoading(true);
            setImageFile(file);
            setImageSrc(await toBase64(file));
            setLoading(false);
        }
    }

    return (
        <Formik
            validationSchema={schema}
            initialValues={{
                ...requiredFormInitialValues(user),
                card: cardFormInitialValues(card),
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
                        <div style={{ width: '100%', marginBottom: 40 }} className="tab-container">
                            <div style={{ justifyContent: 'flex-start' }} className="profile-tab-title">
                                REQUIRED
                            </div>
                            <div className="profile-tab-content">
                                <div className="profile-tab-picture">
                                    <Image src={imageSrc} width="100%" style={{ maxHeight: '20vw' }} />
                                    <Button
                                        size="lg-2"
                                        variant="transparent-black-shadow-disabled"
                                        style={{ width: '100%', marginTop: 10 }}
                                        onClick={() => inputFile.current.click()}
                                        disabled={loading}
                                    >
                                        CHANGE PHOTO
                                    </Button>
                                    <input onChange={uploadFile} accept="image/*" type="file" ref={inputFile} style={{ display: 'none' }} />
                                </div>

                                <div className="profile-tab-form">
                                    <RequiredForm
                                        initialPhoneNumber={user.verified ? user.phone : null}
                                        handleChange={handleChange}
                                        touched={touched}
                                        errors={errors}
                                        values={values}
                                        setFieldValue={setFieldValue}
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={{ width: '100%', marginBottom: 40 }} className="tab-container">
                            <div style={{ justifyContent: 'flex-start' }} className="profile-tab-title">
                                CARD INFORMATION
                            </div>
                            <div className="profile-tab-content">
                                <div className="profile-tab-picture" />

                                <div className="profile-tab-form">
                                    <CardForm
                                        card={card}
                                        payPalDisabled={true}
                                        handleChange={handleChange}
                                        touched={touched}
                                        errors={errors}
                                        setFieldValue={setFieldValue}
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            style={{ width: 243, marginLeft: 'calc(100% - 243px)' }}
                            size="xxl"
                            variant="transparent-black-shadow"
                            type="submit"
                        >
                            SAVE INFO
                            <IoIosArrowForward style={{ fontSize: 24, marginRight: -5, marginLeft: 5 }} />
                        </Button>
                    </Form>
                )
            }
        </Formik >
    );
}

export default Profile;
