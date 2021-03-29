/**
 * Created by i82325 on 5/6/2019.
 */
import React from 'react';
import {NavLink} from 'react-router-dom';
import Navigation from '../Navigation';
import {userService} from '../../service/UserService';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Button} from 'primereact/button';
import {Growl} from 'primereact/growl';
import {InputText} from 'primereact/inputtext';

export class Users extends React.Component {
    constructor() {
        super();
        this.state = {
            users: []
        };
        this.actionTemplate = this.actionTemplate.bind(this);
    }

    componentDidMount() {
        userService.getAll().then(data => {
                this.setState({users: data});
            }
        );
        let message = JSON.parse(sessionStorage.getItem('success'));
        if (message) {
            this.growl.show({
                severity: 'success',
                summary: 'Success!!',
                detail: message
            })
            sessionStorage.removeItem('success');
        };
    }

    actionTemplate(rowData) {
        return (<div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>

            {(JSON.parse(sessionStorage.getItem('userName')) === rowData.userName ||
                JSON.parse(sessionStorage.getItem('role')) === ('1' | 1)) ?
                <Button type="button" icon="pi pi-pencil" style={{margin: 2}}
                        className="ui-button-success"
                        onClick={() => this.editUser(rowData)}
                />
                : null}
            {JSON.parse(sessionStorage.getItem('role')) & 1 ?
                <Button type="submit" icon="pi pi-trash"
                        className="ui-button-warning"
                        onClick={() => this.deleteUser(rowData)}
                />
                : null}
        </div>);
    }

    editUser(rowData) {
        let changePassword = null;
        if (JSON.parse(sessionStorage.getItem('userName')) === rowData.userName) {
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
        let message = 'Are you sure You want to delete user ' + rowData._id;
        if (window.confirm(message)) {
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
        let header = <div style={{'textAlign': 'left', 'float': 'right'}}>
            <i className="pi pi-search" style={{margin: '4px 4px 0 0'}}></i>
            <InputText type="search"
                       onInput={(e) => this.setState({globalFilter: e.target.value})}
                       placeholder="Search" size="50"/>
        </div>;
        return (
            <div>
                <Growl ref={(el) => this.growl = el}/>
                <Navigation/>
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
                            <Column field="roles.roleName" header="Role"
                                    sortable={true}
                                    style={{overflow: 'hidden'}}/>
                            {JSON.parse(sessionStorage.getItem('role')) & (1 | 2) ?
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
};

export default Users;