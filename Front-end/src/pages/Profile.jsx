import React, { Component, Fragment } from 'react';
import { Page, App } from '../containers';
import '../styles/containers/profile.scss';
import { Authentication} from '../util';
import { OrganizationInfo } from '../util/OrganizationInfo';
import { List, Section } from '../components/dashboard';
import { Modal } from '../components';
import { AddAccount } from './AddAccount';

const org = OrganizationInfo.getInstance();
const auth = Authentication.getInstance();

const MAX_SIZE = 120;
export class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: {
        text: '',
        valid: null
      },
      password: {
        text: '',
        valid: null
      },
      hidden: org.getOrganizationType() === "TEQ"? false: true,
      items: [],
      active: 0,
      show: false,
      name: "Save Changes"
    }
  }

  componentDidMount() {
    this.setState({ items: org.getOrganizationsList() })
  }

  setActive = active => this.setState({ active })
  click = key => this.setState({ active: key })
  
  addAccountorEdit = () => {
    this.props.history.push("/app/addAccount");
  }

  itemMap = ({ username, email, name }) => {
    return <Fragment>
      <p className="profile__item-status">{name}</p>
      <button className="profile__delete-org"
      onClick={this.toggleModal}>
        Remove
      </button>
    </Fragment>
  }

  toggleModal = state => this.setState(({show}) => ({
    show: state? state: !show
  }))

  close = () => {
    this.toggleModal(false);
    this.setState({ file: null });
  }

  removeOrg = () => {
    const active = this.state.active;
    org.removeOrganization(active);
    this.close();
  }

  render() {
    const { items, active, show } = this.state;
    if (this.state.hidden){
      return (
        <Page className='profile'>
          <form className="profile__form">
            <div className="profile__organization-info">
            <div className="profile__info-text">
              Organization Name: {org.getOrganizationName(active)} <br/>
            </div>
            <div className="profile__info-text">
              Username: {org.getOrganizationUsername(active)} <br/>
            </div>
            <div className="profile__info-text">
              Email: {org.getOrganizationEmail(active)} <br/>
            </div>
              
            </div>
            <div className="profile__input-group">
              <button 
                className="profile__button-change-pass"
                onClick={this.addAccountorEdit}
                >
                  <i className="fas fa-edit profile__icon"></i>
              </button>
            </div>
          </form>
        </Page>
      )
    } else {
    return (
    <Page className='profile'>
      <div className="profile__container">
        <button className="profile__button-add-account" 
          onClick={this.addAccountorEdit}>
            Add Account
        </button>
        <List block="profile" onClick={this.click} active={active} items={items} map={this.itemMap}>
          <div className="profile__list-header">
            Organizations
          </div>
        </List>
      </div>
      <form className="profile__page">
        <form className="profile__form">
          <div className="profile__organization-info">
          <div className="profile__info-text">
              Organization Name:   {org.getOrganizationName(active)} <br/>
            </div>
            <div className="profile__info-text">
              Username:   {org.getOrganizationUsername(active)} <br/>
            </div>
            <div className="profile__info-text">
              Email:   {org.getOrganizationEmail(active)} <br/>
            </div>
          </div>
          <button 
            className="profile__button-change-pass"
            onClick={this.addAccountorEdit}
            >
              <i className="fas fa-edit profile__icon"></i>
          </button>
        </form>
      </form>
      <Modal show={show} className="upload__modal" close={this.close}>
        <div>
          Are you sure you want to delete the organization?
          <button onClick={this.removeOrg}>
            Delete
          </button>
          <button onClick={this.close}>
            Exit
          </button>
        </div>
      </Modal>
      <AddAccount pageName={this.state.name} key={this.state.active}/>
    </Page>)
    }
  }
}
