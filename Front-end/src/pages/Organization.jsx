import React, { Component, Fragment } from 'react';
import { List, Section } from '../components/dashboard';
import { Page } from '../containers';
import '../styles/pages/organization.scss';
import { Modal, Collection } from '../components';
import { Authentication, request } from '../util';
import { OrganizationForm } from '../components/organization';
import { UserForm } from '../components/user';

export class Organization extends Component {

  state = {
    items: {
      orgs: null, temps: null, users: null
    },
    modal: null,
    show: false,
    active: -1,
    user: undefined,
  }

  constructor(props) {
    super(props);
    this.curr = Authentication.getInstance().getUser();
  }

  async componentDidMount() {
    let items;
    try {
      items = {
        orgs: await request('/orgs'),
        temps: await request('/temp'),
        users: await request(`/users/${this.curr._org}`)
      }
    } catch (err) {
      console.log(err);
      return
    }

    if (!this.unmounted) {
      this.setState({ items, active: 0 });
    }
  }

  componentWillUnmount() { this.unmounted = true }
  close = () => this.toggleModal(false)
  typedModal = modal => this.setState(
    ({show}) => ({ show: !show, modal })
  );
  userModal = ({ currentTarget }) => {
    const user = currentTarget.getAttribute('data-key');
    if (!this.unmounted) {
      this.setState(
        ({show}) => ({
          show: !show,
          modal: 'user',
          user: user === null? undefined: user
        })
      );
    }
  }
  
  setActive = async active => {
    const { items } = this.state;
    items.users = null;
    if (!this.unmounted) {
      this.setState({ active, items });
    }
    try {
      items.users = await request(`/users/${items.orgs[active]._id}`);
      if (!this.unmounted) {
        this.setState({ items });
      }
    } catch (err) {
      console.log(err);
    }
  }

  delete = async () => {
    const { items, active } = this.state;
    try {
      const org = items.orgs[active];
      await request(`/orgs/${org._id}`, 'DELETE');
      items.orgs.splice(active, 1);
      if (!this.unmounted) {
        this.setState({ show: false, items, active: -1 });
      }
    } catch (err) {
      console.log(err);
    }
  }

  dropUser = async () => {
    const { items, user } = this.state;
    const victim = items.users[user];
    try {
      await request(`/users/${victim._org}/${victim._id}`, 'DELETE');
      items.users.splice(user, 1);
    } catch (err) {
      console.log(err);
    }
    if (!this.unmounted) {
      this.setState({ show: false, items, user: undefined });
    }
  }

  post = async item => {
    const { items, active } = this.state;
    items.orgs[active] = item;
    if (!this.unmounted) {
      this.setState({ items });
    }
  }

  addOrg = async item => {
    const { items } = this.state;
    items.orgs.push(item);
    if (!this.unmounted) {
      this.setState({ show: false, items, active: items.length - 1 });
    }
  }

  updateUser = async item => {
    const { items, user } = this.state;
    if (user === undefined) {
      items.users.push(item);
    } else {
      items.users[user] = item;
    }
    if (!this.unmounted) {
      this.setState({ show: false, items, user: undefined });
    }
  }

  toggleModal = state => (
    this.setState(({show}) => ({
      show: state? state: !show
    }))
  )

  itemMap = ({ name, _sys }) => (
    <Fragment>
      <h3 className="orgs__item-title">{ name }</h3>
      <p>{ `${_sys? 'System': 'Regular'} Organization` }</p>
    </Fragment>
  )

  users = ({ firstname, lastname, admin }) => (
    <Fragment>
      <h4 className="orgs__user-head">{ `${firstname} ${lastname}` }</h4>
      <p className="orgs__user-subhead">{ admin? "Admin": "User" }</p>
    </Fragment>
  )

  render() {
    const { items, active, show, modal, user } = this.state;
    return <Page className='orgs'>
      <div className="orgs__list">
        <List block="orgs" onClick={this.setActive} active={active} items={items.orgs} map={this.itemMap}>
          <h3 className="orgs__list-header">Organizations</h3>
          {
            this.curr.admin? <button className="orgs__list-btn" type="button" onClick={this.typedModal.bind(this, 'org')}>
              <i className="orgs__list-btn-icon fas fa-plus"/> Add Organization
            </button>: null
          }
        </List>
      </div>
      <Section className="orgs__page">
        { 
          active > -1?
          <Fragment>
            <OrganizationForm items={items} active={active} update={this.post} buttons={
              () => <button className="orgs__exit green__button" type="button" onClick={this.delete}>Delete</button>
            }/>
            <h2 className="orgs__page-subtitle">Users</h2>
            <Collection block="orgs" items={items.users} layout={this.users} click={this.userModal}/>
            <div className="green__input-group orgs__buttons">
              <button className="orgs__submit green__button" type="submit" onClick={this.userModal}>Add User</button>
            </div>
          </Fragment>:
          <div className="green__loader-wrap">
            <i className="green__loader fas fa-circle-notch"/>Loading...
          </div>
        }
      </Section>
      <Modal show={show} close={this.close}>
        <div className="orgs__modal">
          {
            modal === 'org'?
            <OrganizationForm items={items} clean={show} update={this.addOrg} buttons={
              () => <button className="orgs__exit green__button" type="button" onClick={this.close}>Exit</button>
            }/>:
            modal === 'user'?
            <UserForm items={items.users} clean={show} active={user} update={this.updateUser} buttons={
              () => <Fragment>
                <button className="orgs__drop green__button" type="button" onClick={this.dropUser}>Remove</button>
                <button className="orgs__exit green__button" type="button" onClick={this.close}>Exit</button>
              </Fragment>
            }/>:
            null
          }
        </div>
      </Modal>
    </Page>
  }
}