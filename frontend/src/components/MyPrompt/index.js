import React, { useEffect, useRef } from 'react';
import { Prompt } from 'react-router-dom';

const MyPrompt = ({ promptVisible }) => {
    const mounted = useRef();

    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
        } else {
            if (promptVisible) {
                window.onbeforeunload = () => true
            } else {
                window.onbeforeunload = undefined
            }
        }

        return () => {
            window.onbeforeunload = null;
        }
    }, [promptVisible])


    return (
        <Prompt
            when={promptVisible}
            message="You have unsaved changes, are you sure you want to leave?"
        />
    );
}

export default MyPrompt;
