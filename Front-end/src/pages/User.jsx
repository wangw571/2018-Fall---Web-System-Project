import React, { Component, Fragment } from 'react';
import { request, Authentication } from '../util';
import { List, Section } from '../components/dashboard';
import { UserForm } from '../components/user';
import { Modal } from '../components';
import { Page } from '../containers';
import '../styles/pages/users.scss';
import { Alert } from '../util/Alert';

export class User extends Component {

  state = {
    show: false,
    users: null,
    active: -1
  }

  constructor(props) {
    super(props);
    this.user = Authentication.getInstance().getUser();
    this.alert = Alert.getInstance();
  }

  async componentDidMount() {
    try {
      const users = await request(`/users/${this.user._org}`);
      if (!this.unmounted) {
        this.setState({ users, active: 0 });
      }
    } catch (err) {
      this.alert.errProcess(err);
    }
  }

  componentWillUnmount() { this.unmounted = true }
  close = () => this.toggleModal(false)

  setActive = async active => this.setState({ active })

  toggleModal = state => this.setState(({ show }) => ({
    show: state ? state : !show
  }))

  usersList = ({ firstname, lastname, admin }) => (
    <Fragment>
      <h3 className="users__list-item-h">{ `${firstname} ${lastname}` }</h3>
      <p  className="users__list-item-sh">{ admin? 'Administrator': 'User' }</p>
    </Fragment>
  )

  userSubmit = (item, active) => this.setState(({ users }) => {
    users[active] = item;
    return { users, active };
  })

  addUser = item => {
    const { users } = this.state;
    users.push(item);
    this.setState({ users, show: false, active: users.length - 1 });
  }

  delete = async () => {
    const { users, active } = this.state;
    const user = users[active];

    try {
      await request(
        `/users/${user._org}/${user._id}`, 'DELETE'
      );
      users.splice(active, 1);
      this.setState({ users, active: -1 });
    } catch (err) {
      console.log(err)
    }
  }

  render() {
    const { show, users, active } = this.state;
    const user = active > -1? users[active]: null;
    return <Page className='users'>
      <div className="users__list">
        <List block="users" onClick={this.setActive} items={users} active={active} map={this.usersList}>
          <h3 className="users__list-header">Users</h3>
          <button className="users__list-btn" type="button" onClick={this.toggleModal}>
            <i className="users__list-btn-icon fas fa-plus"/> Add User
          </button>
        </List>
      </div>
      <Section className="users__page">
      {
        user?
        <UserForm items={users} active={active} update={this.userSubmit} buttons={
          () => <button className="users__exit green__button" type="button" onClick={this.delete}>Delete</button>
        }/>:
        <div className="green__loader-wrap">
          <i className="green__loader fas fa-circle-notch"/>Loading...
        </div>
      }
      </Section>
      <Modal show={show} close={this.close}>
        <div className="users__modal">
          <UserForm update={this.addUser} buttons={
            () => <button className="users__exit green__button" type="button" onClick={this.close}>Exit</button>
          }/>
        </div>
      </Modal>
    </Page>
  }
}
