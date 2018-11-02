import React, { Component } from 'react';
import '../styles/containers/addAccount.scss';
import { withRouter } from 'react-router-dom';
import { Page } from '../containers';
import { OrganizationInfo } from '../util/OrganizationInfo';

const org = OrganizationInfo.getInstance();
class _AddAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: {
            text: '',
            valid: true
            },
            password: {
            text: '',
            valid: true
            },
            confirmPassword: {
                text: '',
                valid: true
            },
            email: {
                text: '',
                valid: true
            },
            name: {
                text: '',
                valid: false
            },
            pageName: "",
            key: -1,
            defaultEmail: org.getOrganizationEmail(0),
            defaultName: "",
            defaultUsername: "",
            defaultPassword: ""
        }
    }

    componentDidMount() {
        this.setState({
            pageName: this.props.pageName,
            key: this.props.key
        })
        if (this.state.pageName == "Save Changes"){
            this.setState({
                defaultEmail: org.getOrganizationEmail(this.state.key),
                defaultName: org.getOrganizationName(this.state.key),
                defaultPassword: org.getOrganizationPassword(this.state.key),
                defaultUsername: org.getOrganizationUsername(this.state.key)
            })
        }
    }

    update = ({ target }) => {
    const name = target.name;
    const text = target.value;
    let valid = null;
    let validText = null;
    switch(name) {
        case "name":
        valid = true;
        break;
        case "username":
        valid = true;
        /*validText = new RegExp('[A-Za-z]([A-Za-z]*[0-9]*)+');
        console.log(text);
        console.log(validText.test(text));
        if (validText.test(text)){
            valid = true;
        } else {
            valid = false;
        }*/
        break;
        case "password":
        valid = true;
        /*validText = new RegExp("([A-Za-z]*[0-9]*)+");
        if (validText.test(text)){
            valid = true;
        } else {
            valid = false;
        }*/
        break;
        case "confirm_password":
            valid = this.state.password.text === text;
        break;
        case "email":
        valid = true;
        /*validText = new RegExp("\w+@[A-Za-z]+\.[a-zA-Z]+");
        if (validText){
            valid = true;
        } else {
            valid = false;
            }
        break;
        default:*/
        break;
    }
    this.setState({
        [name]: {
        text, valid
        }
    });
    }

    validClass = ({ text, valid }) => (
    text === ""? "": ` addAccount__input-group--${ valid? "": "in" }valid`
    )
    
    register = el => {
        const { username, email, name, password, confirmPassword } = this.state;
        let valid = password.valid && username.valid && email.valid && name.valid && confirmPassword.valid;
        if (valid){
            org.addOrganization(username, email, name, password);
            this.props.history.push("/app/me");
        }
    }

    render() {
        const { username, password, confirmPassword, email, name } = this.state;
        return (
        <Page className="addAccount">
            <div className="addAccount__title">
                Add Account
            </div>
            
            <form className="addAccount__form">
                <div className="addAccount__input-title">
                    Name for the organization.
                </div>
                <div className={`addAccount__input-group${this.validClass(name)}`}>
                    <i className="fas fa-user addAccount__icon"></i>
                    <input
                    type="text"
                    name="name"
                    defaultValue={this.state.defaultName}
                    placeholder="Name"
                    onChange={this.update}
                    className="addAccount__input"
                    />
                </div>
                <div className="addAccount__input-title">
                    Username for the organization
                </div>
                <div className={`addAccount__input-group${this.validClass(username)}`}>
                    <i className="fas fa-user addAccount__icon"></i>
                    <input
                    type="text"
                    name="username"
                    defaultValue={this.state.defaultUsername}
                    placeholder="Username"
                    onChange={this.update}
                    className="addAccount__input"
                    />
                </div>
                <div className="addAccount__input-title">
                    Email of the organization
                </div>
                <div className={`addAccount__input-group${this.validClass(email)}`}>
                    <i className="fas fa-envelope-square addAccount__icon"></i>
                    <input
                    type="text"
                    name="email"
                    defaultValue={this.state.defaultEmail}
                    placeholder="Email"
                    onChange={this.update}
                    className="addAccount__input"
                    />
                </div>
                <div className="addAccount__input-title">
                    Password
                </div>
                <div className={`addAccount__input-group${this.validClass(password)}`}>
                    <i className="fas fa-key addAccount__icon"></i>
                    <input
                    type="password"
                    name="password"
                    defaultValue={this.state.defaultPassword}
                    placeholder="Password"
                    onChange={this.update}
                    className="addAccount__input"
                    />
                </div>
                <div className="addAccount__input-title">
                    Confirm Password
                </div>
                <div className={`addAccount__input-group${this.validClass(confirmPassword)}`}>
                    <i className="fas fa-key addAccount__icon"></i>
                    <input
                    type="password"
                    name="confirm_password"
                    placeholder="Confirm Password"
                    onChange={this.update}
                    className="addAccount__input"
                    />
                </div>
                <button 
                type="submit"
                className="addAccount__button"
                onClick={this.register}
                >
                    {this.state.pageName}
                </button>
            </form>
        </Page>
    )
  }
}

export const AddAccount = withRouter(_AddAccount);
