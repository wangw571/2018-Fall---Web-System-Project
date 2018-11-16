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
    chart1Data: reportInfo.getData(),
    chart2Data: reportInfo.getData(),
    chart3Data: reportInfo.getData(),
    chart4Data: reportInfo.getData(),
    chart5Data: reportInfo.getData(),
    chart6Data: reportInfo.getData(),
    queries: reportInfo.getQueryList(),
    templates: reportInfo.getTemplates(),
    columns: reportInfo.getColumns(),
    reportsActive: 0,
    showModal: false,
    queryActive: 0,
    userQueries: [0,0,0,0,0,0],
    userColumns: [0,0,0,0,0,0],
    userTemplates: [0,0,0,0,0,0],
    userTitles: [null,null,null,null,null,null],
    activeModal: -1
  }

  /*componentDidMount = el => {
    const {userQueries, userColumns, userTemplates, queries, columms, templates} = this.state;
    var i;
    for (i=0; i<userQueries.length; i++){
      if (userQueries[i] === 0){
        
      }
    }
  }*/
  click = key => this.setState({ reportsActive: key })

  delete = el => {
    console.log("Hello");
    let { items, reportsActive } = this.state;
    items.splice(reportsActive, 1);
    reportInfo.deleteReport(this.state.reportsActive);
  }

  itemMap = ({ title }) => {
    console.log(title);
    return <Fragment>
      <p className="report_title">{title}</p>
      <button onClick={this.delete}>
        Delete
      </button>
    </Fragment>
  }

  close = () => {
    this.toggleModal(false);
  }

  toggleModal = (param, state) => {
    console.log(state);
    this.updateActiveModal(param);
    this.setState(({showModal}) => ({
      showModal: state? state: !showModal
    }))
  }

  updateActiveModal = (modal) => {
    console.log(modal);
    this.setState({
      activeModal: modal
    });
  }

  update = ({name}) => {
    console.log(name);
  }

  queryOptions = event => {
    const {queries} = this.state;
    const selectedIndex = event.target.options.selectedIndex;
    console.log(selectedIndex);
    let copy =this.state.userQueries;
    copy[this.state.activeModal] = queries[selectedIndex];
    this.setState({
      userQueries: copy
    });
  }

  columnOptions = event => {
    const {columns} = this.state;
    const selectedIndex = event.target.options.selectedIndex;
    let copy =this.state.userColumns;
    copy[this.state.activeModal] = columns[selectedIndex];
    this.setState({
      userColumns: copy
    });
  }

  templateOptions = event => {
    const {templates} = this.state;
    const selectedIndex = event.target.options.selectedIndex;
    let copy =this.state.userTemplates;
    copy[this.state.activeModal] = templates[selectedIndex];
    this.setState({
      userTemplates: copy
    });
  }

  addReport = el => {
    // pass templates here
    const {userColumns, userQueries, userTemplates, userTitles, items} = this.state;
    let chart1 = {
      title: userTitles[0],
      query: userQueries[0].name,
      column: userColumns[0].name,
      id: userQueries[0].id,
      template: userTemplates[0].name
    }
    let chart2 = {
      title: userTitles[1],
      query: userQueries[1].name,
      column: userColumns[1].name,
      id: userQueries[1].id,
      template: userTemplates[1].name
    }
    let chart3 = {
      title: userTitles[2],
      query: userQueries[2].name,
      column: userColumns[2].name,
      id: userQueries[2].id,
      template: userTemplates[2].name
    }
    let chart4 = {
      title: userTitles[3],
      query: userQueries[3].name,
      column: userColumns[3].name,
      id: userQueries[3].id,
      template: userTemplates[3].name
    }
    let chart5 = {
      title: userTitles[4],
      query: userQueries[4].name,
      column: userColumns[4].name,
      id: userQueries[4].id,
      template: userTemplates[4].name
    }
    let chart6 = {
      title: userTitles[5],
      query1: userQueries[5].name,
      column: userColumns[5].name,
      id: userQueries[5].id,
      template: userTemplates[5].name
    }
    
    let newReport = {
      title: "Report",
      chart1: chart1,
      chart2: chart2,
      chart3: chart3,
      chart4: chart4,
      chart5: chart5,
      chart6: chart6
    }
    console.log(newReport);
    let reports = items;
    reports.push(newReport);
    this.setState({
      items: reports
    });
  }

  updateTitle = ({target}) => {
    let titles = this.state.userTitles;
    titles[this.state.activeModal] = target.value;
    this.setState({
      userTitles: titles
    })
  }

  generateReport = () => {
    const {userQueries, userTitles, userTemplates, userColumns, activeModal, queries, columns, templates} = this.state;
    if (userQueries[activeModal] === 0){
      var update = userQueries;
      update[activeModal] = queries[0];
      this.setState({
        userQueries: update
      });
    }
    if (userColumns[activeModal] === 0){
      var update = userColumns;
      update[activeModal] = columns[0];
      this.setState({
        userColumns: update
      });
    }
    if (userTemplates[activeModal] === 0){
      var update = userQueries;
      update[activeModal] = templates[0];
      this.setState({
        userTemplates: update
      });
    }
    console.log(userQueries[activeModal]);
    console.log(userColumns[activeModal]);
    console.log(userTemplates[activeModal]);
    console.log(userTitles[activeModal]);
    console.log(activeModal);
    let data = reportInfo.getData(userQueries[activeModal].name, userTemplates[activeModal].name, userColumns[activeModal].name, userQueries[activeModal].id, userTitles[activeModal]);
    switch(activeModal){
      case 0:
        this.setState({
          chart1Data: data
        })
        break;
      case 1:
        this.setState({
          chart2Data: data
        })
        break;
      case 2:
        this.setState({
          chart3Data: data
        })
        break;
      case 3:
        this.setState({
          chart4Data: data
        })
        break;
      case 4:
        this.setState({
          chart5Data: data
        })
        break;
      case 5:
        this.setState({
          chart6Data: data
        })
        break;
      default:
        break;
    }
  }

  render() {
    const {reportsActive, items, showModal, chart1Data, chart2Data, chart3Data, chart4Data, chart5Data, chart6Data} = this.state;
    return <Page className="report">
      <div className="report__container">
        <List block="report" onClick={this.click} active={reportsActive} items={items} map={this.itemMap}>
          <h3 className="report__list-header">Reports</h3>
        </List>
      </div>
      <div className="report__page">
        <div className="report__box" onClick={this.toggleModal.bind(this, 0)}>
          <Chart chartType="BarChart" width="100%" height="200px" data={chart1Data} />
        </div>
        <div className="report__box" onClick={this.toggleModal.bind(this, 1)}>
        <Chart chartType="LineChart" width="100%" height="200px" data={chart2Data} />
        </div>
        <div className="report__box" onClick={this.toggleModal.bind(this, 2)}>
          <Chart chartType="PieChart" width="100%" height="200px" data={chart3Data} />
        </div>
        <div className="report__box" onClick={this.toggleModal.bind(this, 3)}>
          <Chart chartType="AreaChart" width="100%" height="200px" data={chart4Data} />
        </div>
        <div className="report__box" onClick={this.toggleModal.bind(this, 4)}>
          <Chart chartType="ScatterChart" width="100%" height="200px" data={chart5Data} />
        </div>
        <div className="report__box" onClick={this.toggleModal.bind(this, 5)}>
          <Chart chartType="PieChart" width="100%" height="200px" data={chart6Data} />
        </div>
        <button onClick={this.addReport}>
          Add Report
        </button>
      </div>
      <Modal show={showModal} className="report__modal" close={this.close}>
        <form>
          <select itemMap={this.state.queries} onChange={this.queryOptions}>
            {this.state.queries.map((e, key) => {
              return <option key={key}>{e.name}</option>
            })}
          </select>
          <select itemMap={this.state.templates} onChange={this.templateOptions}>
            {this.state.templates.map((e, key) => {
              return <option key={key}>{e.name}</option>
            })}
          </select>
          <select itemMap={this.state.columns} onChange={this.columnOptions}>
            {this.state.columns.map((e, key) => {
              return <option key={key}>{e.name}</option>
            })}
          </select>
          <input placeholder="title" onChange={this.updateTitle}>
          </input>
          <button onClick={this.generateReport}>
            Generate Chart
          </button>
        </form>
      </Modal>
    </Page>
  }
}