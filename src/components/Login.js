/**
 * Created by i82325 on 5/6/2019.
 */
import React, {Component} from 'react';
import {userService} from '../service/UserService';
import {InputText} from 'primereact/inputtext';
import {Panel} from 'primereact/panel';
import {Growl} from 'primereact/growl';
import {Button} from 'primereact/button';
import {NavLink} from 'react-router-dom';


export class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: null,
            password: null,
            loading: false,
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
        const {username, password} = this.state;
        if (!username || !password) {
            this.growl.show({
                severity: 'error',
                summary: 'Error!!',
                detail: 'Username and/or password is invalid!!'
            });

        } else {
            this.setState({loading: true});
            userService.login(username, password)
                .then(
                    user => {
                        const {from} = this.props.location.state || {from: {pathname: "/home"}};
                        this.props.history.push(from);
                    },
                    fail => {
                        this.growl.show({
                            severity: 'error',
                            summary: 'Error!!',
                            detail: 'Username and/or Password Mismatch!!'
                        })
                    }
                );
        }
    }

    render() {
        const {username, password} = this.state;
        return (
            <div className="p-fluid" style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%'
            }}>
                <Growl ref={(el) => this.growl = el}/>
                <Panel header="Login">
                    <form onSubmit={this.handleSubmit}>
                        <div className="p-grid" style={{margin: 20}}>
                            <InputText id="username" defaultValue={username}
                                       type="text" placeholder="Username"
                                       onChange={this.handleChange}/>
                            <InputText id="password" defaultValue={password} style={{marginTop: 20}}
                                       type="password"
                                       placeholder="Password"
                                       onChange={this.handleChange}/>
                            <div className="p-col-12"
                                 style={{marginTop: 20}}>
                                <Button type="submit" label="Submit"/>
                            </div>
                            <div className="p-col-12"
                                 style={{marginTop: 20}}>
                                <NavLink to="/forgotPassword"><Button label="Forgot Password"/></NavLink>
                            </div>
                        </div>
                    </form>
                </Panel>
            </div>
        );
    };
}
export default Login;

/*<div className="p-col-12"
     style={{marginTop: 20,float:'left'}}>
    <Button type="submit" label="Submit"/>
</div>
<div className="p-col-12"
style={{marginTop: 20,float:'right'}}>
<Button type="submit" label="Forgot Password"/>
    </div>
    <div style={{clear:'both'}}></div>*/