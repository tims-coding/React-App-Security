import React, { useEffect } from 'react';
import useAuth from '../helpers/hooks/useAuth';
import LoginPage from '../pages/Login';

export const AuthCheck = ({ user, children }) => {
    useEffect(() => {
        console.log('hello', user);
    }, [user]);

    if (!user) return (
        <LoginPage />
    )

    return children;
}