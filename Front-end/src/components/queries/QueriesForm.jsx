import React, { Component, Fragment } from 'react';
import '../../styles/pages/queries.scss';
import { request } from '../../util';
import { Alert, queriesAlert } from '../../util/Alert';

const SPACE = "\t";
export class QueriesForm extends Component {

  constructor(props) {
    super(props);
    this.alert = Alert.getInstance();
  }
  
  state = {
    name: "",
    query: null,
    result: "",
    running: false,
    dirty: false
  }

  async componentDidMount() {
    const { items, active } = this.props;

    if (items && active > -1) {
      const { _id } = items[active];
      try {
        const { name, query } = await request(`/queries/${_id}`);
        this.setState({ name, query });
      } catch (err) {
        this.alert.errProcess(err);
      }
    }
  }

  async componentDidUpdate(prevProps) {
    const { items, active } = this.props;
    if (prevProps.active !== active) {
      this.setState({ query: null, result: "", dirty: false });

      if (items && active > -1) {
        const { _id } = items[active];
        try {
          const { name, query } = await request(`/queries/${_id}`);
          this.setState({ name, query });
        } catch (err) {
          this.alert.errProcess(err);
        }
      }
    }
  }

  update = async ({ currentTarget: { name, value } }) => (
    this.setState({ [name]: value, dirty: true })
  )

  submit = async el => {
    el.preventDefault();
    const { name, query } = this.state;
    const { items, active, update } = this.props;
    const clean = query.replace(/\n/g, "").replace(/\t/g, "");
  
    try {
      JSON.parse(clean);
    } catch (err) {
      this.alert.errProcess(queriesAlert);
      return
    }

    try {
      const data = await request(
        `/queries/${active? items[active]._id: ""}`,
        'POST',
        { name, query: clean }
      );
      update(data, active);
      this.setState({ dirty: false });
    } catch (err) {
      this.alert.errProcess(err);
    }
  }

  run = async () => {
    const { items, active } = this.props;
    this.setState({ running: true, result: null });
    try {
      const id = items[active]._id;
      const result = await request(`/queries/${id}`, 'PUT');
      this.setState({ running: false, result: JSON.stringify(result) });
    } catch (err) {
      this.alert.errProcess(err);
      this.setState({ running: false, result: JSON.stringify(err) });
    }
  }
  

  process(result, tab = 0, indent = true) {
    let res = "";
    if (Array.isArray(result)) {
      res += SPACE.repeat(indent? tab: 0) + "[\n";
      result.forEach(item => res += this.process(item, tab + 1));
      res += SPACE.repeat(tab) + "]\n";
    } else if (result !== null && typeof(result) === 'object') {
      const keys = Object.keys(result);
      res += SPACE.repeat(indent? tab: 0) + "{\n";
      keys.forEach(key => res += SPACE.repeat(tab + 1) + `${key}: ${this.process(result[key], tab + 1, false)}`);
      res += SPACE.repeat(tab) + "}\n";
    } else {
      res += SPACE.repeat(indent? tab: 0) + result + "\n";
    }
    return res;
  }

  render() {
    const { name, query, dirty, result, running } = this.state;
    const { buttons, active } = this.props;
    return query || active === undefined?
      <Fragment>
        <form className="queries__page-form" onSubmit={this.submit}>
          <div className="green__input-group">
            <label className="green__input-label" htmlFor="name">Name of query</label>
            <input
              type="text" name="name" className="green__input" value={name} onChange={this.update}
            />
          </div>
          <div className="green__input-group">
            <label className="green__input-label" htmlFor="query">Query</label>
            <textarea name="query" className="green__input" value={query || ""} onChange={this.update}/>
          </div>
          <div className="green__input-group orgs__buttons">
            <button className="orgs__submit green__button" type="submit" disabled={!dirty}>Save</button>
            { buttons? buttons(): null }
          </div>
        </form>
        <h2 className="query__header query__header--mid">Test Query</h2>
        <div className="green__input-group orgs__buttons">
          <button className="orgs__submit green__button" type="button" onClick={this.run} disabled={dirty || running}>
            Run Query
          </button>
        </div>
        {
          result !== null?
          <Fragment>
            { result !== ""? <textarea className="green__input query__result" value={ this.process(JSON.parse(result)) } disabled/>: null }
            { result !== ""? <h5>{ JSON.parse(result).length + " results" }</h5>: null }
          </Fragment>:
          <div className="green__input query__result green__loader-wrap">
            <i className="green__loader fas fa-circle-notch"/>Loading...
          </div>
        }
      </Fragment>:
      <div className="green__loader-wrap">
        <i className="green__loader fas fa-circle-notch"/>Loading...
      </div>
  }
}