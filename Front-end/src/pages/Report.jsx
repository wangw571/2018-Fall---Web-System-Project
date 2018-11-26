import React, { Component, Fragment } from 'react';
import { List, Section } from '../components/dashboard';
import { ReportCreate, ReportPage } from '../components/reports';
import { request } from '../util';
import { Modal } from '../components';
import { Page } from '../containers';
import '../styles/pages/report.scss';
import { toast } from 'react-toastify';

export class Report extends Component {

  state = {
    items: null,
    queries: null,
    active: -1,
    show: false
  }

  async componentDidMount() {
    try {
      const items = await request('/report');
      const queries = await request('/queries');
      this.setState({ items, queries, active: items.length - 1 });
    } catch (err) {
      console.log(err);
      toast.error("Error getting reports");
    }
  }

  toggleModal = state => (
    this.setState(({show}) => ({
      show: state? state: !show, type: 0
    }))
  )

  close = () => this.setState({ show: false });
  set = async data => this.setState(data);

  itemMap = ({ name, date }) => {
    const dateObj = new Date(date);
    return <Fragment>
      <h3 className="orgs__item-title">{ name }</h3>
      <p>{ dateObj.toLocaleDateString() }</p>
    </Fragment>
  }

  render() {
    const { active, queries, items, show } = this.state;
    return <Page className="report">
      <div className="report__container">
        <List block="report" onClick={this.click} active={active} items={items} map={this.itemMap}>
          <h3 className="report__list-header">Reports</h3>
          <button className="orgs__list-btn" type="button" onClick={this.toggleModal}>
            <i className="orgs__list-btn-icon fas fa-plus"/> Add Report
          </button>
        </List>
      </div>
      <Section className="report__section">
      {
        active > -1?
        <ReportPage items={items} active={active} queries={queries} update={this.set}/>:
        null
      }
      </Section>
      <Modal show={show} className="report__modal" close={this.close}>
        <ReportCreate items={items} active={active} close={this.close} clear={show} update={this.set}/>
      </Modal>
    </Page>
  }
}