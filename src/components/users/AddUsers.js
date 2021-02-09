/**
 * Created by i82325 on 5/6/2019.
 */
import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import Navigation from '../Navigation';
import {userService} from '../../service/UserService';
import {InputText} from 'primereact/inputtext';
import {Panel} from 'primereact/panel';
import {Growl} from 'primereact/growl';
import {Button} from 'primereact/button';
import {Dropdown} from 'primereact/dropdown';

export class AddUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: null,
            lastName: null,
            userName: null,
            password: null,
            email: null,
            permissionLevel: null,

        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        const {id, value} = e.target;
        this.setState({[id]: value});
    }

    handleSubmit(e) {
        e.preventDefault();
        const {firstName, lastName, userName, password, email, permissionLevel} = this.state;
        if (!firstName || !lastName || !userName || !password || !email || !permissionLevel) {
            this.growl.show({
                severity: 'error',
                summary: 'Error!!',
                detail: 'Field/s should not be blank to create a user!!'
            });

        } else if (!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
            this.growl.show({
                severity: 'error',
                summary: 'Error!!',
                detail: 'Email pattern is not a match!! Use xxxx@xxxx.xxx'
            });
        } else {
            let code = this.state.permissionLevel.code;
            this.setState({permissionLevel: code}, () => {
                userService.createUser(this.state)
                    .then(
                        data => {
                            if (data.error) {
                                this.growl.show({
                                    severity: 'error',
                                    summary: 'Error!!',
                                    detail: data.error
                                })
                            } else {
                                const {from} = this.props.location.state || {from: {pathname: "/users"}};
                                sessionStorage.setItem('success', JSON.stringify("User has been created!!!"));
                                this.props.history.push(from);
                            }
                        }
                    );
            });

        }
    }

    render() {
        const {firstName, lastName, userName, password, email, permissionLevel} = this.state;
        const permissions = [
            {name: 'Admin', code: "2048"},
            {name: 'Paid', code: "4"},
            {name: 'Normal', code: "1"}];
        return (
            <div>
                <Navigation />
                <p></p>
                <div className="p-col-12 p-lg-6">
                    <NavLink to="/users">
                        <Button label="Back" icon="pi pi-arrow-left"/>
                    </NavLink>
                    <p></p>
                    <Growl ref={(el) => this.growl = el}/>
                    <Panel header="Add User">
                        <form onSubmit={this.handleSubmit}>
                            <div className="p-grid" style={{margin: 20}}>
                                <InputText id="firstName"
                                           defaultValue={firstName}
                                           style={{margin: 20}}
                                           type="text"
                                           placeholder="FirstName"
                                           onChange={this.handleChange}/>
                                <InputText id="lastName"
                                           defaultValue={lastName}
                                           style={{margin: 20}}
                                           type="text"
                                           placeholder="LastName"
                                           onChange={this.handleChange}/>
                                <InputText id="userName"
                                           defaultValue={userName}
                                           style={{margin: 20}}
                                           type="text"
                                           placeholder="Username"
                                           onChange={this.handleChange}/>
                                <InputText id="password"
                                           defaultValue={password}
                                           style={{margin: 20}}
                                           type="password"
                                           placeholder="Password"
                                           onChange={this.handleChange}/>
                                <InputText id="email"
                                           defaultValue={email}
                                           style={{margin: 20}}
                                           type="text"
                                           placeholder="Email"
                                           onChange={this.handleChange}/>
                                <Dropdown id="permissionLevel"
                                          value={permissionLevel}
                                          options={permissions}
                                          onChange={this.handleChange}
                                          placeholder="Select a Role"
                                          optionLabel="name"/>
                                <div className="p-col-12"
                                     style={{margin: 20}}>
                                    <Button type="submit" label="Add User"/>
                                </div>
                            </div>
                        </form>
                    </Panel>
                </div>
            </div>
        );
    }
}
;

export default AddUsers;