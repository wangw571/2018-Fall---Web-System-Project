import React, { Component } from 'react';
import { CHARTS } from '../../values';

export class SectionCreate extends Component {

  state = {
    name: "",
    query: 0,
    meta: null,
    type: 0
  }

  update = async ({ currentTarget }) => this.setState({ [currentTarget.name]: currentTarget.value })

  submit = async el => {
    el.preventDefault();
    const { name, query, type } = this.state;
    this.props.update({ name, query, type: parseInt(type) });
  }

  delete = async () => this.props.update(null)

  async componentDidMount() {
    const { items, active } = this.props;
    if (items && active > -1) {
      const { name, query, type } = items[active];
      this.setState({ name, query, type });
    }
  }

  async componentDidUpdate(prevProps) {
    const { active, items } = this.props;
    if (prevProps.active !== active && active > -1) {
      const { name, query, type } = items[active];
      this.setState({ name, query, type });
    }
  }

  render() {
    const { name, query, type } = this.state;
    const { close, queries, active } = this.props;
    return <form className="report__create" onSubmit={this.submit}>
      <h2>Section Details</h2>
      <div className="green__input-group">
        <label className="green__input-label" htmlFor="name">Name of Section</label>
        <input
          type="text" name="name" className="green__input" value={name} onChange={this.update}
        />
      </div>
      <div className="green__input-group">
        <label className="green__input-label" htmlFor="query">Query</label>
        <select className="green__input green__input--select" name="query" value={query} onChange={this.update}>
          {
            queries?
            queries.map((item, key) => <option key={key} value={key}>{ item.name }</option>):
            null
          }
        </select>
      </div>
      <div className="green__input-group">
        <label className="green__input-label" htmlFor="type">Type</label>
        <select className="green__input green__input--select" name="type" value={type} onChange={this.update}>
          { CHARTS.map((item, key) => <option key={key} value={key}>{ item.slice(0, 1).toUpperCase() + item.slice(1) }</option>) }
        </select>
      </div>
      <div className="green__input-group report__create-btns">
        <button className="green__button report__create-btn report__create-btn--submit" type="submit">Save</button>
        {
          active === -1? null:
          <button className="green__button report__create-btn report__create-btn--remove" type="button" onClick={this.delete}>Delete</button>
        }
        <button className="green__button report__create-btn report__create-btn--exit" type="button" onClick={close}>Exit</button>
      </div>
    </form>
  }
}