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

export class EditUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            oldPassword: null,
            newPassword: null
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handlePasswordSubmit = this.handlePasswordSubmit.bind(this);
    }

    handleChange(e) {
        const {id, value} = e.target;
        this.setState({[id]: value});
    }

    handlePasswordSubmit(e) {
        e.preventDefault();
        const {oldPassword, newPassword} = this.state;
        if (!oldPassword || !newPassword) {
            this.growl.show({
                severity: 'error',
                summary: 'Error!!',
                detail: 'Field/s should not be blank to Change Password!!'
            });

        } else {
            userService.changePassword(this.state._id, oldPassword, newPassword)
                .then(
                    data => {
                        if (data.error) {
                            this.growl.show({
                                severity: 'error',
                                summary: 'Error!!',
                                detail: data.error
                            });
                        } else {
                            this.growl.show({
                                severity: 'success',
                                summary: 'Success!!',
                                detail: data.message
                            });
                            this.setState({oldPassword: '', newPassword: ''});
                            document.getElementById('oldPassword').value = '';
                            document.getElementById('newPassword').value = '';
                        }
                    }
                );
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        const {firstName, lastName, email} = this.state;
        if (!firstName || !lastName || !email) {
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
            if (this.state.permissionLevel.code) {
                let code = this.state.permissionLevel.code;
                this.setState({permissionLevel: code}, () => {
                    this.userUpdate(this.state);
                });
            } else {
                this.userUpdate(this.state);
            }


        }
    }

    userUpdate(userObject) {
        userService.updateUser(userObject)
            .then(
                data => {
                    if (data.error) {
                        this.growl.show({
                            severity: 'error',
                            summary: 'Error!!',
                            detail: data.error
                        });

                    } else {
                        const {from} = this.props.location.state || {from: {pathname: "/users"}};
                        sessionStorage.setItem('success', JSON.stringify("User has been Updated!!!"));
                        this.props.history.push(from);
                    }
                }
            );
    }

    componentDidMount() {
        let id = null;
        if (this.props.location.rowData) {
            id = this.props.location.rowData._id;
            userService.getUser(id).then(data => {
                this.setState({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    permissionLevel: data.permissionLevel,
                    _id: data.id,
                });
            });
        } else {
            this.props.history.push({pathname: '/users'});
        }
    }

    render() {
        const permissions = [
            {name: 'Admin', code: "2048"},
            {name: 'Paid', code: "4"},
            {name: 'Normal', code: "1"}];
        const {newPassword, oldPassword} = this.state;
        const {firstName, lastName, email, permissionLevel} = this.state;
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
                    <Panel header="Edit User">
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
                                <InputText id="email"
                                           defaultValue={email}
                                           style={{margin: 20}}
                                           type="text"
                                           placeholder="Email"
                                           onChange={this.handleChange}/>
                                {sessionStorage.getItem('permissionLevel') & 2048 ?
                                    <Dropdown id="permissionLevel"
                                              value={permissionLevel}
                                              options={permissions}
                                              onChange={this.handleChange}
                                              placeholder={permissionLevel === 4 ? permissions.find((o) => o.code === '4').name
                                                  : (permissionLevel === 2048 ? permissions.find((o) => o.code === '2048').name : permissions.find((o) => o.code === '1').name)}
                                              optionLabel="name"/>
                                    : null}
                                <div className="p-col-12"
                                     style={{margin: 20}}>
                                    <Button type="submit" label="Update User"/>
                                </div>
                            </div>
                        </form>
                    </Panel>
                    {this.props.location.isPasswordChange ?
                        <Panel header="Change Password">
                            <form onSubmit={this.handlePasswordSubmit}>
                                <div className="p-grid" style={{margin: 20}}>
                                    <InputText id="oldPassword"
                                               defaultValue={oldPassword}
                                               style={{margin: 20}}
                                               type="password"
                                               placeholder="Old Password"
                                               onChange={this.handleChange}/>
                                    <InputText id="newPassword"
                                               defaultValue={newPassword}
                                               style={{margin: 20}}
                                               type="password"
                                               placeholder="New Password"
                                               onChange={this.handleChange}/>
                                    <div className="p-col-12"
                                         style={{margin: 20}}>
                                        <Button type="submit"
                                                label="Update Password"/>
                                    </div>
                                </div>
                            </form>
                        </Panel> : null
                    }
                </div>
            </div>
        );
    }
}
;

export default EditUsers;