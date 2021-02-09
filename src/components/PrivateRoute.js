/**
 * Created by i82325 on 5/7/2019.
 */
import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        sessionStorage.getItem('accessToken')?
            <Component {...props} /> :
            <Redirect to={{ pathname: '/', state: { from: '/home' } }} />
    )} />
)
