import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Login from './components/Login';
import {PrivateRoute} from './components/PrivateRoute';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import Users from './components/users/Users';
import Roles from './components/roles/Roles';
import AddUsers from './components/users/AddUsers';
import EditUsers from './components/users/EditUsers';
import Error from './components/Error';
import ForgotPassword from './components/ForgotPassword';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

function App() {
    return (
        <BrowserRouter>
            <Switch>
                {!JSON.parse(sessionStorage.getItem('userName')) &&
                <Route path="/" exact component={Login}/>}
                {JSON.parse(sessionStorage.getItem('userName')) &&
                <Route path="/" exact component={Home}/>}
                <PrivateRoute path="/home" component={Home}/>
                <PrivateRoute path="/roles" component={Roles}/>
                <PrivateRoute path="/about" component={About}/>
                <PrivateRoute path="/contact" component={Contact}/>
                <PrivateRoute path="/users" component={Users}/>
                <PrivateRoute path="/addUser" component={AddUsers}/>
                <PrivateRoute path="/editUser" component={EditUsers}/>
                <Route path="/forgotPassword" component={ForgotPassword}/>
                <PrivateRoute component={Error}/>
            </Switch>
        </BrowserRouter>
    );
}

export default App;
