import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBreadcrumbContext } from 'AppContext';
import { privacyUrl, shopUrl } from 'utilities/appUrls';

import './terms.css';

const Terms = () => {
    const { setBreadcrumb } = useBreadcrumbContext();

    useEffect(() => {
        setBreadcrumb("TERMS AND CONDITIONS", [{ text: "SHOP", href: shopUrl }, { text: "TERMS AND CONDITIONS" }]);
        // eslint-disable-next-line
    }, [])

    return (
        <div className="terms-container">
            <h1 style={{ marginBottom: 30 }}>
                Introduction
            </h1>
            <div className="terms-text">
                These Website Standard Terms and Conditions written on this webpage shall manage your use of our website, Auction app accessible at https://auction-app.netlify.app.
                <br />
                These Terms will be applied fully and affect to your use of this Website. By using this Website, you agreed to accept all terms and conditions written in here. You must not use this Website if you disagree with any of these Website Standard Terms and Conditions.
            </div>

            <div className="terms-title">
                Intellectual Property Rights
            </div>
            <div className="terms-text">
                Other than the content you own, under these Terms, Auction app and/or its licensors own all the intellectual property rights and materials contained in this Website.
                <br />
                You are granted limited license only for purposes of viewing the material contained on this Website.
            </div>

            <div className="terms-title">
                Restrictions
            </div>
            <div className="terms-text">
                You are specifically restricted from all of the following:
                <br />
                <ul>
                    <li>publishing any Website material in any other media;</li>
                    <li>selling, sublicensing and/or otherwise commercializing any Website material;</li>
                    <li>publicly performing and/or showing any Website material;</li>
                    <li>using this Website in any way that is or may be damaging to this Website;</li>
                    <li>using this Website in any way that impacts user access to this Website;</li>
                    <li>using this Website contrary to applicable laws and regulations, or in any way may cause harm to the Website, or to any person or business entity;</li>
                    <li>engaging in any data mining, data harvesting, data extracting or any other similar activity in relation to this Website;</li>
                    <li>using this Website to engage in any advertising or marketing.</li>
                </ul>
                <br />
                Certain areas of this Website are restricted from being access by you and Auction app may further restrict access by you to any areas of this Website, at any time, in absolute discretion. Any user ID and password you may have for this Website are confidential and you must maintain confidentiality as well.
            </div>

            <div className="terms-title">
                Your Content
            </div>
            <div className="terms-text">
                In these Website Standard Terms and Conditions, "Your Content" shall mean any audio, video text, images or other material you choose to display on this Website. By displaying Your Content, you grant Auction app a non-exclusive, worldwide irrevocable, sub licensable license to use, reproduce, adapt, publish, translate and distribute it in any and all media.
                <br />
                Your Content must be your own and must not be invading any third-party’s rights. Auction app reserves the right to remove any of Your Content from this Website at any time without notice.
            </div>

            <div className="terms-title">
                Your Privacy
            </div>
            <div className="terms-text">
                Please read <Link className="purple-nav-link" to={privacyUrl}>Privacy Policy</Link>.
            </div>

            <div className="terms-title">
                No warranties
            </div>
            <div className="terms-text">
                This Website is provided "as is," with all faults, and Auction app express no representations or warranties, of any kind related to this Website or the materials contained on this Website. Also, nothing contained on this Website shall be interpreted as advising you.
            </div>

            <div className="terms-title">
                Limitation of liability
            </div>
            <div className="terms-text">
                In no event shall Auction app, nor any of its officers, directors and employees, shall be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract.  Auction app, including its officers, directors and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website.
            </div>

            <div className="terms-title">
                Indemnification
            </div>
            <div className="terms-text">
                You hereby indemnify to the fullest extent Auction app from and against any and/or all liabilities, costs, demands, causes of action, damages and expenses arising in any way related to your breach of any of the provisions of these Terms.
            </div>

            <div className="terms-title">
                Severability
            </div>
            <div className="terms-text">
                If any provision of these Terms is found to be invalid under any applicable law, such provisions shall be deleted without affecting the remaining provisions herein.
            </div>

            <div className="terms-title">
                Variation of Terms
            </div>
            <div className="terms-text">
                Auction app is permitted to revise these Terms at any time as it sees fit, and by using this Website you are expected to review these Terms on a regular basis.
            </div>

            <div className="terms-title">
                Assignment
            </div>
            <div className="terms-text">
                The Auction app is allowed to assign, transfer, and subcontract its rights and/or obligations under these Terms without any notification. However, you are not allowed to assign, transfer, or subcontract any of your rights and/or obligations under these Terms.
            </div>

            <div className="terms-title">
                Entire Agreement
            </div>
            <div className="terms-text">
                These Terms constitute the entire agreement between Auction app and you in relation to your use of this Website, and supersede all prior agreements and understandings.
            </div>

            <div className="terms-title">
                Governing Law &amp; Jurisdiction
            </div>
            <div className="terms-text">
                These Terms will be governed by and interpreted in accordance with the laws of the State of ba, and you submit to the non-exclusive jurisdiction of the state and federal courts located in ba for the resolution of any disputes.
            </div>
        </div>
    );
}

export default Terms;
