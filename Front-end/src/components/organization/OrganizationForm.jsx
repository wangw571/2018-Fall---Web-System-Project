import React, { Component, Fragment } from 'react';
import '../../styles/pages/organization.scss';
import { Switch, Collection } from '../.';
import { request } from '../../util';

export class OrganizationForm extends Component {

  state = {
    name: '',
    type: false,
    perms: [],
    dirty: false
  }

  componentDidMount() {
    const { items, active } = this.props;
    if (active !== undefined) {
      const item = items.orgs[active];
      this.setState({
        name: item.name,
        type: item._sys,
        perms: this.getPerms(item.permissions)
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { items, active, clean } = this.props;
    if (active !== undefined && prevProps.active !== active) {
      const item = items.orgs[active];
      this.setState({
        name: item.name,
        type: item._sys,
        perms: this.getPerms(item.permissions),
        dirty: false
      });
    } else if (prevProps.clean !== clean) {
      this.setState({
        name: '',
        type: false,
        perms: [],
        dirty: false
      });
    }
  }

  getPerms = ids => {
    const perms = [];
    const { temps } = this.props.items;
    if (temps) {
      ids = ids || [];
      temps.forEach(({ _id }, key) => ids.indexOf(_id) > -1? perms.push(key): null);
    }
    return perms;
  }

  templates = ({ name }) => (
    <div className="orgs__temp">
      <i className="orgs__temp-icon fas fa-check"/>
      <h3 className="orgs__temp-head">{ name.length > 70? name.slice(0,70) + '...': name }</h3>
    </div>
  )

  update = async ({ currentTarget }) => {
    const el = currentTarget.name;
    let { name, type, perms } = this.state;
    switch(el) {
      case 'name':
        name = currentTarget.value;
        break;
      case 'type':
        type = currentTarget.checked;
        break;
      default:
        const i = currentTarget.getAttribute('data-key');
        const j = perms.indexOf(parseInt(i));
        if (j > -1) { perms.splice(j, 1) }
        else { perms.push(parseInt(i)) }
        break;
    }
    this.setState({ name, type, perms, dirty: true });
  }

  submit = async el => {
    el.preventDefault();
    const { active, items, update } = this.props;
    const { name, type, perms } = this.state;
    try {
      const org = active !== undefined ? items.orgs[active]._id: '';
      const res = await request(`/orgs/${org}`, 'POST', {
        name, _sys: type,
        permissions: perms.map(i => items.temps[i]._id)   
      });
      update(res, active);
      this.setState({ dirty: false });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const { name, type, perms, dirty } = this.state;
    const { items, active, buttons } = this.props;
    return (
      active !== -1?
      <Fragment>
        <h1 className="orgs__page-title">Organization Information</h1>
        <h2 className="orgs__page-subtitle">Administration</h2>
        <form className="orgs__page-form" onSubmit={this.submit}>
          <div className="green__input-group">
            <label className="green__input-label" htmlFor="name">Name of Organization</label>
            <input
              type="text" name="name" className="green__input" value={name} onChange={this.update}
            />
          </div>
          <div className="green__input-group">
            <label className="green__input-label" htmlFor="type">System Organization?</label>
            <Switch className="orgs" name="type" value={type} onChange={this.update}/>
          </div>
          <div className="green__input-group">
            <label className="green__input-label">Template Access</label>
            <Collection block="orgs" items={items.temps} active={perms} layout={this.templates} click={this.update} />
          </div>
          <div className="green__input-group orgs__buttons">
            <button className="orgs__submit green__button" type="submit" disabled={!dirty}>Save</button>
            { buttons? buttons(): null }
          </div>
        </form>
      </Fragment>: null
    )
  }
}