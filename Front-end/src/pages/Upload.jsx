import React, { Component, Fragment } from 'react';
import { List, Section } from '../components/dashboard';
import { Page } from '../containers';

import '../styles/pages/upload.scss';
import { Modal } from '../components';
import { request, reduce } from '../util';

const MAX_SIZE = 120;
export class Upload extends Component {

  state = {
    items: null,
    submits: null,
    show: false,
    active: -1,
    file: null
  }

  async componentDidMount() {
    let items;
    let submits;
    try {
      // Get templates and submissions
      items = await request('/temp');
      submits = await request('/submit');
    } catch (err) {
      console.log(err);
      return
    }

    const rSubmit = await reduce(submits, '_temp');
    // Merge into list of templates with submission info
    items.forEach(item => {
      const sub = rSubmit[item._id];
      if (sub) {
        item.submitted = sub.submitted;
        item.date = sub.date;
      }
    });
    this.setState({ items, submits, active: items.length - 1 });
  }

  getStatus = status => {
    if (status === undefined) {
      return "Missing";
    } else if (status) {
      return "Submitted";
    } else {
      return "Uploaded";
    }
  }

  getDiff = date => "10 Days"
  setActive = active => this.setState({ active })

  send = async el => {
    el.preventDefault();
    const { file, items, active, submits } = this.state;
    const body = new FormData();
    body.append("file", file);
    try {
      const item = items[active];
      const res = await request(
        `/submit/${item._id}`,
        'POST',
        body
      );
      item.submitted = res.submitted;
      item.date = res.date;
      this.setState({ items, submits: (submits.push(res), submits) });
    } catch (err) {
      console.log(err);
    }
    this.close();
  }

  close = () => {
    this.toggleModal(false);
    this.setState({ file: null });
  }

  handleFile = ({ target }) => (
    this.setState({ file: target.files.length === 0? null: target.files[0] })
  )

  itemMap = ({ name, description, date, submitted }) => {
    const statusText = this.getStatus(submitted);

    return <Fragment>
      <div className="upload__item-header">
        <p className={`upload__item-status upload__item-status--${ statusText.toLowerCase() }`}>
          { statusText }
        </p>
        <p className="upload__item-label">
          <i className="upload__item-icon far fa-clock" />
          { this.getDiff(date) }
        </p>
      </div>
      <h4 className="upload__item-title">{ name }</h4>
      <p className="upload__item-text">
        { description.length > MAX_SIZE ? description.slice(0, MAX_SIZE) + "..." : description }
      </p>
    </Fragment>
  }

  toggleModal = state => this.setState(({show}) => ({
    show: state? state: !show
  }))

  render() {
    const { items, active, show, file, submits } = this.state;
    const item = active > -1? items[active]: null;
    const submit = active > -1? submits[active]: null;
    return <Page className='upload'>
      <div className="upload__list">
        <List block="upload" onClick={this.setActive} active={active} items={items} map={this.itemMap}>
          <h3 className="upload__upload-header">Templates</h3>
        </List>
      </div>
      <Section className="upload__page">
        {
          item?
          <Fragment>
            <h1 className="upload__page-title">{ item.name.length > 60? item.name.slice(0, 60) + '...': item.name }</h1>
            <button className="upload__page-button" type="button" onClick={this.toggleModal}>
              Upload File
            </button>
          </Fragment>:
          null
        }
      </Section>
      <Modal show={show} className="upload__modal" close={this.close}>
        <form onSubmit={this.send} className={`upload__form${file ? " upload__form--uploaded" : ""}`}>
          <div className="upload__file-drop">
            <input onChange={this.handleFile} className="upload__file" type="file"/>
            <i className="upload__file-icon fas fa-cloud-upload-alt" />
            <p className="upload__file-header">{ file? "Uploaded": "Drag and drop or click here" }</p>
            <p className="upload__file-subheader">{ file? file.name: "to upload your iCare" }</p>
          </div>
          <div className="upload__button-wrapper">
            <button className="upload__button upload__button--submit" type="submit" disabled={!file}>Submit</button>
            <button className="upload__button upload__button--exit" type="button" onClick={this.close}>Exit</button>
          </div>
        </form>
      </Modal>
    </Page>
  }
}