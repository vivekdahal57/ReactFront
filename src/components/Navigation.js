import {NavLink} from 'react-router-dom';
import {userService} from '../service/UserService';
import React, {Component} from 'react';


export class Navigation extends Component {
    constructor() {
        super();
        this.state = {};
    }

    render() {
        return (
            <div>
                <div style={{backgroundColor: "#000000"}}>
                    <img alt="logo" height="50px" src="primereact-logo.png"
                         style={{marginLeft: '3px'}}/>
                    <p style={{
                        float: "right",
                        color: '#ffffff',
                        marginRight: '16px'
                    }}>
                        Welcome {JSON.parse(sessionStorage.getItem('user'))}
                    </p>
                </div>
                <div className="navigation" style={{clear: "both", marginTop: '15px'}}>
                    <ul>
                        <li><NavLink to="/home">Home</NavLink></li>
                        <li><NavLink to="/about">About</NavLink></li>
                        <li><NavLink to="/users">Users</NavLink></li>
                        <li><NavLink to="/contact">Contact</NavLink></li>
                        <li style={{float: "right"}}>
                            <NavLink to="/logout"
                                     onClick={userService.logout}>Logout</NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        )
    };
}
;

export default Navigation;