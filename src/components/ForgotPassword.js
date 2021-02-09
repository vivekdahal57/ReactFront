/**
 * Created by i82325 on 5/6/2019.
 */
import React, {Component} from 'react';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import {Panel} from 'primereact/panel';
import {Growl} from 'primereact/growl';
import {userService} from '../service/UserService';

export class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: null,
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
        const {email} = this.state;
        if (!email) {
            this.growl.show({
                severity: 'error',
                summary: 'Error!!',
                detail: 'Email cannot be null or Empty!!'
            });

        } else if (!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
            this.growl.show({
                severity: 'error',
                summary: 'Error!!',
                detail: 'Email pattern is not a match!! Use xxxx@xxxx.xxx'
            });
        } else {
            userService.getUserByEmail(email)
                .then(
                    // user => {
                    //     const {from} = this.props.location.state || {from: {pathname: "/home"}};
                    //     this.props.history.push(from);
                    // },
                    fail => {
                        this.growl.show({
                            severity: 'error',
                            summary: 'Error!!',
                            detail: 'Email not found!!'
                        })
                    }
                );
        }
    }

    render() {
        return (
            <div className="p-fluid" style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%'
            }}>
                <Growl ref={(el) => this.growl = el}/>
                <Panel header="Forgot Password">
                    <form onSubmit={this.handleSubmit}>
                        <InputText id="email" defaultValue={this.state.email}
                                   type="text" placeholder="Email"
                                   onChange={this.handleChange}/>
                        <div className="p-col-12"
                             style={{marginTop: 20}}>
                            <Button type="submit" label="Submit"/>
                        </div>
                    </form>
                </Panel>
            </div>
        )
    };
}
;

export default ForgotPassword;