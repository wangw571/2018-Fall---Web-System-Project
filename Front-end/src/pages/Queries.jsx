import React, { Component, Fragment } from 'react';
import { List, Section } from '../components/dashboard';
import { Modal } from '../components';
import { Page } from '../containers';
import '../styles/pages/queries.scss';
import { request } from '../util';
import { QueriesForm } from '../components/queries';
import { toast } from 'react-toastify';

export class Queries extends Component {
  
  state = {
    items: null,
    active: -1,
    show: false
  }

  async componentDidMount() {
    try {
      const items = await request('/queries');
      this.setState({ items, active: 0 });
    } catch (err) {
      console.log(err);
      toast.error("Error getting queries");
    }
  }

  componentWillUnmount() { this.unmounted = true; }

  mapItems = ({ name, date }) => {
    const dateObj = new Date(date);
    return <Fragment>
      <h3>{ name }</h3>
      <p>{ dateObj.toLocaleDateString() }</p>
    </Fragment>
  }

  setActive = active => this.setState({ active })

  add = async item => {
    const { items } = this.state;
    items.push({ _id: item._id, name: item.name, date: item.date });
    toast("Query successfully added");
    if (!this.unmounted) {
      this.setState({ items, show: false, active: items.length - 1 });
    }
  }

  update = (item, active) => {
    const { items } = this.state;
    const curr = items[active];
    items[active] = {
      ...curr,
      name: item.name,
      date: item.date
    };
    if (!this.unmounted) {
      this.setState({ items });
    }
  }

  toggleModal = state => (
    this.setState(({show}) => ({
      show: state? state: !show
    }))
  )

  close = () => this.toggleModal(false)

  delete = async () => {
    const { items, active } = this.state;
    const curr = items[active];
    try {
      await request(`/queries/${curr._id}`, 'DELETE');
      items.splice(active, 1);
      if (!this.unmounted) {
        this.setState({ items, active: -1 });
      }
    } catch (err) {
      this.alert.errProcess(err);
    }
  }

  render() {
    const { items, active, show } = this.state;
    const item = active > -1? items[active]: null;
    return <Fragment>
      <Page className="query">
        <div className="query__list">
          <List block="query" onClick={this.setActive} active={active} items={items} map={this.mapItems}>
            <h3 className="query__list-header">Queries</h3>
            <button className="orgs__list-btn" type="button" onClick={this.toggleModal}>
              <i className="orgs__list-btn-icon fas fa-plus"/> Add Query
            </button>
          </List>
        </div>
        <Section className="query__page">
          {
            item?
            <Fragment>
              <h1 className="query__header">Query Information</h1>
              <QueriesForm items={items} active={active} update={this.update} buttons={() =>
                <button className="orgs__exit green__button" type="button" onClick={this.delete}>Delete</button>
              }/>
            </Fragment>:
            <div className="green__loader-wrap">
              <i className="green__loader fas fa-circle-notch"/>Loading...
            </div>
          }
        </Section>
      </Page>
      <Modal show={show} close={this.close}>
        <div className="query__modal">
          <h2>Create a new query</h2>
          <QueriesForm clear={!show} update={this.add} buttons={() =>
            <button className="orgs__exit green__button" type="button" onClick={this.close}>Exit</button>
          }/>
        </div>
      </Modal>
    </Fragment> 
  }
}