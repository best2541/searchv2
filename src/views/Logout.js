import React from 'react';
import { Redirect } from 'react-router-dom';

const Logout = () => {
    window.localStorage.removeItem('userAccessToken');
    return (
        <Redirect to="/admin/category"/>
    );
}

export default Logout;