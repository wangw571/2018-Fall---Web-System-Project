import React, { Component, Fragment } from 'react';
import { Page } from '../containers';
import { List } from '../components/dashboard';
import '../styles/containers/report.scss';
import { Chart } from 'react-google-charts';
import { Modal } from '../components';
import { ReportsInfo } from '../util/ReportsInfo';

const reportInfo = ReportsInfo.getInstance();

export class Report extends Component {

  state = {
    items: reportInfo.getReports(),
    data: reportInfo.getData(0),
    queries: reportInfo.getQueryList(),
    active: 0,
    showModal: false,
    queryActive: 0
  }

  click = key => this.setState({ active: key })

  itemMap = ({ title }) => {
    return <Fragment>
      <p className="report_title">{title}</p>
      <button onclick={this.delete}>
        Delete
      </button>
    </Fragment>
  }
  
  delete = el => {
    let { items, active } = this.state;
    items.splice(active, 1);
  }

  close = () => {
    this.toggleModal(false);
  }

  toggleModal = state => this.setState(({showModal}) => ({
    showModal: state? state: !showModal
  }))

  options = event => {
    const selectedIndex = event.target.options.selectedIndex;
    console.log(selectedIndex);
    this.setState({
      queryActive: selectedIndex
    });
    this.setState({
      data: reportInfo.getData(selectedIndex)
    });
  }

  addReport = el => {

  }

  render() {
    const {active, items, showModal, data} = this.state;
    return <Page className="report">
      <div className="report__container">
        <List block="report" onClick={this.click} active={active} items={items} map={this.itemMap}>
          <h3 className="report__list-header">Reports</h3>
        </List>
      </div>
      <div className="report__page">
        <div className="report__box" onClick={this.toggleModal}>
        <Chart chartType="BarChart" width="100%" height="200px" data={data} />
        </div>
        <div className="report__box" onClick={this.toggleModal}>
        <Chart chartType="LineChart" width="100%" height="200px" data={data} />
        </div>
        <div className="report__box" onClick={this.toggleModal}>
          <Chart chartType="PieChart" width="100%" height="200px" data={data} />
        </div>
        <div className="report__box" onClick={this.toggleModal}>
          <Chart chartType="PieChart" width="100%" height="200px" data={data} />
        </div>
        <div className="report__box" onClick={this.toggleModal}>
          <Chart chartType="PieChart" width="100%" height="200px" data={data} />
        </div>
        <div className="report__box" onClick={this.toggleModal}>
          <Chart chartType="PieChart" width="100%" height="200px" data={data} />
        </div>
        <button onClick={this.addReport}>
          Add Report
        </button>
      </div>
      <Modal show={showModal} className="report__modal" close={this.close}>
        <form>
          <select itemMap={this.state.queries} onChange={this.options}>
            {this.state.queries.map((e, key) => {
              return <option key={key}>{e.name}</option>
            })}
          </select>
          <input placeholder="title">
          </input>
        </form>
      </Modal>
    </Page>
  }
}