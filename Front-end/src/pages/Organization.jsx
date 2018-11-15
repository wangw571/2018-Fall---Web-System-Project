import React, { Component, Fragment } from 'react';
import { List, Section } from '../components/dashboard';
import { Page } from '../containers';
import '../styles/pages/organization.scss';
import { Modal, Collection } from '../components';
import { Authentication, request } from '../util';
import { OrganizationForm } from '../components/organization';

const user = Authentication.getInstance().getUser();
export class Organization extends Component {

  state = {
    items: {
      orgs: null, temps: null, users: null
    },
    show: false,
    active: -1
  }

  async componentDidMount() {
    let items;
    try {
      items = {
        orgs: await request('/orgs'),
        temps: await request('/temp'),
        users: await request(`/users/${user._org}`)
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
  
  setActive = async active => {
    const { items } = this.state;
    items.users = null;
    this.setState({ active, items });
    try {
      items.users = await request(`/users/${items.orgs[active]._id}`);
      this.setState({ items });
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
      this.setState({ items, active: 0 });
    } catch (err) {
      console.log(err);
    }
  }

  post = async (item, active) => {
    const { items } = this.state;
    items.orgs[active] = item;
    this.setState({ items });
  }

  addOrg = async item => {
    const { items } = this.state;
    items.orgs.push(item);
    this.setState({ show: false, items, active: items.length - 1 });
  }

  toggleModal = state => (
    this.setState(({show}) => ({
      show: state? state: !show
    }))
  )

  itemMap = ({ name, _sys }) => (
    <Fragment>
      <h4 className="orgs__item-title">{ name }</h4>
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
    const { items, active, show } = this.state;
    return <Page className='orgs'>
      <div className="orgs__list">
        <List block="orgs" onClick={this.setActive} active={active} items={items.orgs} map={this.itemMap}>
          <h3 className="orgs__list-header">Organizations</h3>
          {
            user.admin? <button className="orgs__list-btn" type="button" onClick={this.toggleModal}>
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
            <Collection block="orgs" items={items.users} layout={this.users}/>
          </Fragment>: null
        }
      </Section>
      <Modal show={show} className="orgs__modal" close={this.close}>
        <OrganizationForm items={items} update={this.addOrg} buttons={
          () => <button className="orgs__exit green__button" type="button" onClick={this.close}>Exit</button>
        }/>
      </Modal>
    </Page>
  }
}