/**
 * Created by i82325 on 5/6/2019.
 */
import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import Navigation from '../Navigation';
import {userService} from '../../service/UserService';
import {roleService} from '../../service/RoleService';
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
            roles: null,
            roleNames: []
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        roleService.getRoles()
            .then(data => {
                    this.setState({roleNames: data});
                }
            );
    }

    handleChange(e) {
        const {id, value} = e.target;
        this.setState({[id]: value});
    }

    handleSubmit(e) {
        e.preventDefault();
        const {firstName, lastName, userName, password, email, roles} = this.state;
        if (!firstName || !lastName || !userName || !password || !email || !roles) {
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
            userService.createUser(this.state)
                .then(data => {
                        const {from} = this.props.location.state || {from: {pathname: "/users"}};
                        sessionStorage.setItem('success', JSON.stringify("User has been created!!!"));
                        this.props.history.push(from);
                    }
                ).catch(e => {
                this.growl.show({
                    severity: 'error',
                    summary: 'Error!!',
                    detail: e
                });
            });
        }
    }

    render() {
        const {firstName, lastName, userName, password, email, roles} = this.state;
        return (
            <div>
                <Navigation/>
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
                                <Dropdown id="roles"
                                          value={roles}
                                          options={this.state.roleNames}
                                          onChange={this.handleChange}
                                          placeholder="Select a Role"
                                          optionLabel="roleName"/>
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
};

export default AddUsers;