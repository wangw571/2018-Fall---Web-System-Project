import React, { Component } from 'react';
import { request } from '../../util';
import '../../styles/components/upload/table.scss';

export class Table extends Component {

  state = {
    temp: null,
    data: null
  }

  async componentDidUpdate(prevProps) {
    const { items, active } = this.props;
    if (prevProps.active !== active) {
      this.setState({ temp: null, data: null });
      const { _id } = items[active];
      try {
        const temp = await request(`/temp/${_id}`);
        const data = await request(`/submit/${_id}`);
        this.setState({
          temp: temp.columns,
          data: data.data
        });
      } catch (err) {
        console.log(err);
      }
    }
  }

  async componentDidMount() {
    const { items, active } = this.props;
    if (active > -1) {
      const { _id } = items[active];
      try {
        const temp = await request(`/temp/${_id}`);
        const data = await request(`/submit/${_id}`);
        console.log(data);
        this.setState({
          temp: temp.columns,
          data: data.data
        });
      } catch (err) {
        console.log(err);
      }
    }
  }

  update = async ({ currentTarget }) => {
    const { data } = this.state;
    const row = currentTarget.getAttribute('data-row');
    const col = currentTarget.getAttribute('data-col');
    data[row][col] = currentTarget.value;
    this.setState({ data });
  }

  render() {
    const { temp, data } = this.state;
    return (
      temp && data?
      <div className="table">
        <div className="table__main">
          <div className="table__body">
            <div className="table__row table__row--header">
              {
                temp.map(({ name }, key) =>
                  <div key={key} className="table__col">{ name }</div>
                )
              }
            </div>
            {
              data.map((row, key) => 
                <div key={key} className="table__row">
                  {
                    row.map((col, key2) =>
                      <div key={key2} className="table__col">
                        <input type="text" data-row={key} data-col={key2} onChange={this.update} value={col? col: "" } />
                      </div>
                    )
                  }
                </div>
              )
            }
          </div>
        </div>
      </div>:
      <div className="green__loader-wrap">
        <i className="green__loader fas fa-circle-notch"/>Loading...
      </div>
    );
  }
}