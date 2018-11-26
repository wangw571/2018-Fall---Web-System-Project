import React, { Component } from 'react';
import { request } from '../../util';
import { toast } from 'react-toastify';

export class ReportCreate extends Component {

  state = {
    name: "",
    dirty: false
  }

  update = async ({ currentTarget }) => this.setState({ name: currentTarget.value, dirty: true })

  submit = async el => {
    el.preventDefault();
    const { update, items } = this.props;
    try {
      const { _id, name, date } = await request('/report', 'POST', {
        name: this.state.name,
        content: []
      });
      toast("Report successfully updated");
      items.push({ _id, name, date });
      await update({ items, show: false, active: items.length - 1 });
    } catch (err) {
      console.log(err);
      toast.error("Error updating report");
    }
  }

  componentDidUpdate(prevProps) {
    const { clear } = this.props;
    if (!clear && prevProps.clear !== clear) {
      this.setState({ name: "", dirty: false });
    }
  }

  render() {
    const { name, dirty } = this.state;
    const { close } = this.props;
    return <form className="report__create" onSubmit={this.submit}>
      <h2>Create a Report</h2>
      <div className="green__input-group">
        <label className="green__input-label" htmlFor="name">Name of Report</label>
        <input
          type="text" name="name" className="green__input" value={name} onChange={this.update}
        />
      </div>
      <div className="green__input-group report__create-btns">
        <button className="green__button report__create-btn report__create-btn--submit" type="submit" disabled={!dirty}>Save</button>
        <button className="green__button report__create-btn report__create-btn--exit" type="button" onClick={close}>Exit</button>
      </div>
    </form>
  }
}