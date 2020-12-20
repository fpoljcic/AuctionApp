import React from 'react'
import { Button } from 'react-bootstrap';
import SocialLogin from 'react-social-login'

function SocialButton(props) {

    return (
        <Button onClick={props.triggerLogin} {...props}>
            {props.children}
        </Button>
    );
}

export default SocialLogin(SocialButton);
