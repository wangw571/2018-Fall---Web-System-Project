import React, { Component } from 'react';
import { request, sortByAscending, sortByDescending } from '../../util';
import '../../styles/components/upload/table.scss';
import { TableRow } from '.';

export class Table extends Component {

  state = {
    temp: null,
    data: null,
    selected: -1,
    ascending: true
  }

  async componentDidUpdate(prevProps) {
    const { active } = this.props;
    if (prevProps.active !== active) {
      this.setState({ temp: null, data: null });
      await this.getData();
    }
  }

  async componentDidMount() {
    const { active } = this.props;
    if (active > -1) {
      await this.getData();
    }
  }

  getData = async () => {
    const { items, active, set } = this.props;
    const { _id } = items[active];
    try {
      const temp = await request(`/temp/${_id}`);
      const { data } = await request(`/submit/${_id}`);
      set(data);
      this.setState({ temp: temp.columns, data });
    } catch (err) {
      console.log(err);
    }
  }

  update = async ({ target }) => {
    if (target) {
      const { data } = this.state;
      const row = target.getAttribute('data-row');
      const col = target.getAttribute('data-col');
      data[row][col] = target.innerHTML;
      this.setState({ data });
      this.props.set(data);
    }
  }

  sort = async ({ target }) => {
    const { selected, data, ascending } = this.state;
    const curr = parseInt(target.getAttribute('data-key'));
    const order = selected === curr? !ascending: true;

    if (order) {
      sortByAscending(data, curr);
    } else {
      sortByDescending(data, curr);
    }

    this.setState({ selected: curr, data, ascending: order });
  }

  render() {
    const { temp, data, ascending, selected } = this.state;
    const { disabled } = this.props;
    return (
      temp && data?
      <div className="table">
        <div className="table__main">
          <div className="table__body">
            <div className="table__row table__row--header">
              {
                temp.map(({ name }, key) => {
                  const cName = `table__col${selected === key? ` table__col--active table__col--${ascending? "ascend": "descend"}`: ""}`;
                  return <div key={key} data-key={key} onClick={this.sort} className={cName}>{ name }</div>
                })
              }
            </div>
            { data.map((row, key) => <TableRow disabled={disabled} key={key} row={row} update={this.update} index={key} />) }
          </div>
        </div>
      </div>:
      <div className="green__loader-wrap">
        <i className="green__loader fas fa-circle-notch"/>Loading...
      </div>
    );
  }
}