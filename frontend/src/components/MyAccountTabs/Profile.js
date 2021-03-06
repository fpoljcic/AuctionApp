import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Formik } from 'formik';
import RequiredForm, { requiredFormInitialValues, requiredFormSchema } from 'components/Forms/RequiredForm';
import CardForm, { cardFormInitialValues, cardFormSchema } from 'components/Forms/CardForm';
import OptionalForm, { optionalFormInitialValues, optionalFormSchema } from 'components/Forms/OptionalForm';
import { getUser, setSession } from 'utilities/localStorage';
import { Button, Form, Image, Spinner } from 'react-bootstrap';
import { IoIosArrowForward } from 'react-icons/io';
import { placeholderImage, toBase64 } from 'utilities/common';
import { getDate } from 'utilities/date';
import { homeUrl } from 'utilities/appUrls';
import { getCard } from 'api/card';
import { uploadImage } from 'api/image';
import { updateUser } from 'api/auth';
import { useAlertContext } from 'AppContext';
import * as yup from 'yup';

import './myAccountTabs.css';

const Profile = () => {
    const { showMessage } = useAlertContext();

    const history = useHistory();
    const user = getUser();
    const inputFile = useRef(null);

    const [imageSrc, setImageSrc] = useState(user.photo);
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [card, setCard] = useState({});
    const [cardEmpty, setCardEmpty] = useState(true);
    const [isValid, setIsValid] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setCard(await getCard());
            } catch (e) { }
        }
        fetchData();
    }, [])

    const schema = yup.object().shape({
        ...requiredFormSchema,
        card: cardFormSchema(cardEmpty, card.cardNumber)
            .test("card-empty", "", card => {
                setCardEmpty(Object.keys(card).every(prop => card[prop] === undefined));
                return true;
            }),
        ...optionalFormSchema
    });

    const deleteProperties = (userData) => {
        delete userData.day;
        delete userData.month;
        delete userData.year;
        if (cardEmpty)
            delete userData.card;
    }

    const handleSubmit = async (data) => {
        setIsValid(true);
        setUploading(true);
        const userData = { ...data };
        userData.dateOfBirth = getDate(data.day, data.month, data.year);
        deleteProperties(userData);
        try {
            if (imageSrc === placeholderImage)
                userData.photo = imageSrc;
            else if (imageFile !== null)
                userData.photo = await uploadImage(imageFile);
            const data = await updateUser(userData);
            setSession(data.person, data.token);
            showMessage("success", "You have successfully updated your profile info!");
        } catch (e) { }
        setUploading(false);
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

    const removeImage = () => {
        setLoading(true);
        setImageSrc(placeholderImage);
        setLoading(false);
    }

    return (
        <Formik
            validationSchema={schema}
            initialValues={{
                ...requiredFormInitialValues(user),
                card: cardFormInitialValues(card),
                ...optionalFormInitialValues(user)
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
                                    <Image src={imageSrc} className="profile-img" />
                                    <Button
                                        size="lg-2"
                                        variant="transparent-black-shadow-disabled"
                                        block
                                        style={{ marginTop: 10, marginBottom: 10 }}
                                        onClick={() => inputFile.current.click()}
                                        disabled={loading}
                                    >
                                        {loading ? "LOADING" : "CHANGE PHOTO"}
                                    </Button>
                                    {imageSrc !== placeholderImage ?
                                        <Button
                                            size="lg-2"
                                            variant="fill-red-shadow"
                                            block
                                            style={{ marginTop: 10, marginBottom: 10 }}
                                            onClick={removeImage}
                                            disabled={loading}
                                        >
                                            {loading ? "LOADING" : "REMOVE PHOTO"}
                                        </Button> : null}
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

                        <div style={{ width: '100%', marginBottom: 40 }} className="tab-container">
                            <div style={{ justifyContent: 'flex-start' }} className="profile-tab-title">
                                OPTIONAL
                            </div>
                            <div className="profile-tab-content">
                                <div className="profile-tab-picture" />

                                <div className="profile-tab-form">
                                    <OptionalForm
                                        handleChange={handleChange}
                                        touched={touched}
                                        errors={errors}
                                        values={values}
                                        setFieldValue={setFieldValue}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="profile-buttons">
                            <Button
                                style={{ width: 243, marginRight: 20 }}
                                size="xxl"
                                variant="transparent-black-shadow-disabled"
                                onClick={() => history.push(homeUrl)}
                            >
                                CANCEL
                            </Button>

                            <Button
                                style={{ width: 243 }}
                                size="xxl"
                                variant="transparent-black-shadow"
                                type="submit"
                                onClick={() => setIsValid(false)}
                                disabled={uploading}
                            >
                                {uploading ? (
                                    <>
                                        SAVING
                                    <Spinner className="text-spinner" animation="border" />
                                    </>
                                ) : (
                                        <>
                                            SAVE INFO
                                        <IoIosArrowForward style={{ fontSize: 24, marginRight: -5, marginLeft: 5 }} />
                                        </>
                                    )}
                            </Button>
                        </div>
                        {isValid === false ?
                            <Form.Control.Feedback style={{ display: "block", textAlign: 'right' }} type="invalid">
                                *Please fill in the required fields
                            </Form.Control.Feedback> : null}
                    </Form>
                )
            }
        </Formik >
    );
}

export default Profile;
