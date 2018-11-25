import React, { Component, Fragment } from 'react';
import { Line, Pie, HorizontalBar } from 'react-chartjs-2';
import { request, chartify } from '../../util';
import { DEFAULT_CHART_OPTIONS } from '../../values';
import { toast } from 'react-toastify';

export class ReportSection extends Component {

  state = {
    data: null
  }

  async componentDidMount() {
    const { item, queries } = this.props;
    try {
      const index = item.query;
      const data = await request(`/queries/${queries[index]._id}`, 'PUT');
      this.setState({ data: await chartify(data) });
    } catch (err) {
      console.log(err);
      toast.error("Error getting getting section info");
    }
  }

  async componentDidUpdate(prevProps) {
    const { item, queries } = this.props;
    if (item.query !== prevProps.item.query) {
      try {
        const index = item.query;
        const data = await request(`/queries/${queries[index]._id}`, 'PUT');
        this.setState({ data: await chartify(data) });
      } catch (err) {
        console.log(err);
        toast.error("Error getting getting section info");
      }    
    }
  }

  render() {
    const { data } = this.state;
    const { item, onClick, index } = this.props;
    return <li onClick={onClick} data-key={index} className="report__page-section">
      {
        data?
        <Fragment>
          <h2 className="report__page-head">{ item.name }</h2>
          {
            item.type === 0? <HorizontalBar options={DEFAULT_CHART_OPTIONS} data={data} />:
            item.type === 1? <Line data={data} />:
            item.type === 2? <Pie data={data} />:
            null
          }
        </Fragment>:
        <div className="green__loader-wrap report__loader">
          <i className="green__loader fas fa-circle-notch"/>Loading...
        </div>
      }
    </li>
  }
}