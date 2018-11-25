import React, { Component, Fragment } from 'react';
import { SectionCreate } from '.';
import { Modal } from '../';
import { request } from '../../util';
import { ReportSection } from './ReportSection';
import { toast } from 'react-toastify';

export class ReportPage extends Component {

  state = {
    name: "",
    content: null,
    show: false,
    active: -1,
    curr: -1
  }

  async componentDidMount() {
    const { items, active } = this.props;
    if (items && active > -1) {
      const item = items[active];
      try {
        const { name, content } = await request(`/report/${item._id}`);
        this.setState({ name, content });
      } catch (err) {
        console.log(err);
        toast.error("Error getting report information");
      }
    }
  }

  toggleModal = state => (
    this.setState(({show}) => ({
      show: state? state: !show
    }))
  )

  close = () => this.setState({ show: false });
  set = async data => {
    const { name, content, curr } = this.state;
    if (curr === -1) {
      content.push(data);
    } else if (data === null) {
      content.splice(curr, 1);
    } else {
      content[curr] = data;
    }
    this.setState({ name, content, show: false, dirty: true })
  };

  save = async () => {
    const { items, active, update } = this.props;
    const { name, content } = this.state;

    try {
      const res = await request(`/report/${items[active]._id}`, 'POST', {
        name, content
      });
      toast("Report successfully updated");
      items[active] = res;
      await update({ items });
      this.setState({ dirty: false });

    } catch (err) {
      console.log(err);
      toast.error("Error updating report");
    }
  }

  delete = async () => {
    const { items, active, update } = this.props;
    try {
      await request(`/report/${items[active]._id}`, 'DELETE');
      toast("Report successfully deleted");
      items.splice(active, 1);
      await update({ items, active: -1 });
    } catch (err) {
      console.log(err);
      toast.error("Error deleting report");
    }
  }

  modify = async ({ currentTarget }) => {
    const curr = currentTarget.getAttribute('data-key');
    this.setState({ curr: parseInt(curr), show: 1 });
  }

  create = async () => this.setState({ curr: -1, show: true })

  updateName = async ({ target }) => {
    if (target) {
      this.setState({ name: target.innerHTML, dirty: true });
    }
  }

  render() {
    const { name, content, dirty, show, curr } = this.state;
    const { queries } = this.props;
    return content? <Fragment>
      <div className="report__page">
        <h1 onBlur={this.updateName} contentEditable suppressContentEditableWarning>{ name }</h1>
        <div className="report__controls">
          <button className="upload__button upload__button--controls" onClick={this.save} type="button" disabled={!dirty}>Save</button>
          <button className="upload__button upload__button--controls" onClick={this.delete} type="button">Delete</button>
        </div>
        <ul className="report__page-content">
          {
            content.map((item, key) => <ReportSection onClick={this.modify} queries={queries} item={item} index={key} key={key}/>)
          }
          <li onClick={this.create} className="report__page-section report__page-section--empty">
            <p>Add a section</p>
          </li>
        </ul>
      </div>
      <Modal show={show} className="report__modal" close={this.close}>
        <SectionCreate queries={queries} items={content} active={curr} close={this.close} update={this.set}/>
      </Modal>
    </Fragment>:
    <div className="green__loader-wrap">
      <i className="green__loader fas fa-circle-notch"/>Loading...
    </div>
  }
}