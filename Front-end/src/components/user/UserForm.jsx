import React, { Component, Fragment } from 'react';
import { request, Authentication } from '../../util';
import { Switch } from '..';
import { toast } from 'react-toastify';

const user = Authentication.getInstance().getUser();
export class UserForm extends Component {

  state = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    admin: false,
    dirty: false
  }

  componentDidMount() {
    const { items, active } = this.props;
    if (active !== undefined) {
      const user = items[active];
      this.setState({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        admin: user.admin
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { items, active, clean } = this.props;
    if (active !== undefined && prevProps.active !== active) {
      const user = items[active];
      this.setState({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        admin: user.admin,
        dirty: false
      });
    } else if (prevProps.clean !== clean) {
      this.setState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        admin: false,
        dirty: false
      });
    }
  }

  update = async ({ currentTarget }) => {
    const { name, value, checked } = currentTarget;
    const state = this.state;
    switch(name) {
      case 'admin':
        state[name] = checked;
        break;
      default:
        state[name] = value;
    }
    this.setState({ ...state, dirty: true });
  }

  submit = async el => {
    el.preventDefault();
    const { firstname, lastname, email, password, admin } = this.state;
    const { items, active, update } = this.props;
    const item = items && active !== undefined? items[active]: null;

    const body = { firstname, lastname, email, admin }
    if (password !== '') { body.password = password }

    try {
      const res = await request(
        item? `/users/${item._org}/${item._id}`: `/users/${user._org}`,
        'POST', body
      );
      update(res, active);
      this.setState({ dirty: false });
      toast('User successfully updated');
    } catch (err) {
      console.log(err);
      toast.error('Error updating user');
    }
  }

  render() {
    const { firstname, lastname, email, password, admin, dirty } = this.state;
    const { buttons, active } = this.props;
    return (
      <Fragment>
        <h1 className="users__page-title">User Information</h1>
        <form className="users__page-form" onSubmit={this.submit}>
          <div className="green__input-group">
            <label className="green__input-label" htmlFor="firstname">First Name</label>
            <input
              type="text" name="firstname" className="green__input" value={firstname} onChange={this.update}
            />
          </div>
          <div className="green__input-group">
            <label className="green__input-label" htmlFor="lastname">Last Name</label>
            <input
              type="text" name="lastname" className="green__input" value={lastname} onChange={this.update}
            />
          </div>
          <div className="green__input-group">
            <label className="green__input-label" htmlFor="email">Email</label>
            <input
              type="email" name="email" className="green__input" value={email} onChange={this.update}
            />
          </div>
          <div className="green__input-group">
            <label className="green__input-label" htmlFor="password">
              { active !== undefined? 'New ': '' }Password
            </label>
            <input
              type="password" name="password" className="green__input" value={password} onChange={this.update}
            />
          </div>
          <div className="green__input-group">
            <label className="green__input-label" htmlFor="admin">Administrator?</label>
            <Switch className="users" name="admin" value={admin} onChange={this.update}/>
          </div>
          <div className="green__input-group users__buttons">
              <button className="users__submit green__button" type="submit" disabled={!dirty}>Save</button>
              { buttons? buttons(): null }
            </div>
        </form>
      </Fragment>
    );
  }
}