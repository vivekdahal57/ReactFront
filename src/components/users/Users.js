/**
 * Created by i82325 on 5/6/2019.
 */
import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import Navigation from '../Navigation';
import {userService} from '../../service/UserService';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Button} from 'primereact/button';
import {Growl} from 'primereact/growl';
import {InputText} from 'primereact/inputtext';

export class Users extends Component {
    constructor() {
        super();
        this.state = {
            users: []
        };
        this.actionTemplate = this.actionTemplate.bind(this);
    }

    componentDidMount() {
        userService.getAll().then(data => this.setState({users: data}));
        let message = JSON.parse(sessionStorage.getItem('success'));
        if (message) {
            this.growl.show({
                severity: 'success',
                summary: 'Success!!',
                detail: message
            })
            sessionStorage.removeItem('success');
        }
    }

    actionTemplate(rowData) {
        return (<div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            {(JSON.parse(sessionStorage.getItem('userId')) === rowData._id || sessionStorage.getItem('permissionLevel') === '2048' ) ?
                <Button type="button" icon="pi pi-pencil" style={{margin: 2}}
                        className="ui-button-success"
                        onClick={() => this.editUser(rowData)}
                />
                : null}
            {sessionStorage.getItem('permissionLevel') & 2048 ?
                <Button type="submit" icon="pi pi-trash"
                        className="ui-button-warning"
                        onClick={() => this.deleteUser(rowData)}
                />
                : null}
        </div>);
    }

    editUser(rowData) {
        let changePassword = null;
        if (JSON.parse(sessionStorage.getItem('userId')) === rowData._id) {
            changePassword = true;
        } else {
            changePassword = false;
        }
        this.props.history.push({
            pathname: '/editUser',
            rowData: rowData, // your data array of objects,
            isPasswordChange: changePassword
        })
    }


    deleteUser(rowData) {
        var msg = 'Are you sure You want to delete user ' + rowData._id;
        if (window.confirm(msg)) {
            userService.deleteUser(rowData._id).then(() => {
                this.growl.show({
                    severity: 'success',
                    summary: 'Success!!',
                    detail: 'User Deleted!!'
                })
            })
        }
        this.componentDidMount();
    }

    render() {
        var header = <div style={{'textAlign': 'left', 'float': 'right'}}>
            <i className="pi pi-search" style={{margin: '4px 4px 0 0'}}></i>
            <InputText type="search"
                       onInput={(e) => this.setState({globalFilter: e.target.value})}
                       placeholder="Search" size="50"/>
        </div>;
        this.state.users.forEach(function (item) {
            if (item.permissionLevel === 2048 || item.permissionLevel === '2048') {
                item.permissionLevel = 'Admin';
            } else if (item.permissionLevel === 1 || item.permissionLevel === '1') {
                item.permissionLevel = 'Normal';
            } else if (item.permissionLevel === 4 || item.permissionLevel === '4') {
                item.permissionLevel = 'Premium';
            }
        });

        return (

            <div>
                <Growl ref={(el) => this.growl = el}/>
                <Navigation />
                <p></p>
                <div className="p-col-12 p-lg-6">
                    <NavLink to="/addUser">
                        <Button label="Create User" icon="pi pi-check"/>
                    </NavLink>
                    {header}
                    <p></p>
                    <div className="card">
                        <DataTable value={this.state.users} header='Users List'
                                   style={{marginBottom: '20px'}}
                                   paginator={true}
                                   rows={10}
                                   rowsPerPageOptions={[5, 10, 20]}
                                   globalFilter={this.state.globalFilter}>
                            <Column field="firstName" header="First Name"
                                    sortable={true}/>
                            <Column field="lastName" header="Last Name"
                                    sortable={true}/>
                            <Column field="userName" header="User Name"
                                    sortable={true}
                                    style={{overflow: 'hidden'}}/>
                            <Column field="email" header="Email"
                                    sortable={true}
                                    style={{overflow: 'hidden'}}/>
                            <Column field="permissionLevel" header="Permission"
                                    sortable={true}
                                    style={{overflow: 'hidden'}}/>
                            {sessionStorage.getItem('permissionLevel') & (4 | 2048) ?
                                <Column body={this.actionTemplate}
                                        header="Actions"/>
                                : <Column body={this.actionTemplate}
                                          header="Actions"
                                          style={{display: 'none'}}/>
                            }
                        </DataTable>
                    </div>
                </div>
            </div>
        );
    }
}
;

export default Users;