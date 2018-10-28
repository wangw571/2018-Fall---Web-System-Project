import React, { Component, Fragment } from 'react';
import { List, Section } from '../components/dashboard';
import { Page } from '../containers';

import '../styles/pages/upload.scss';
import { Modal } from '../components';

const test = [
  {
    status: 0,
    title: "What is Lorem Ipsum?",
    due: new Date(),
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque suscipit urna quis purus congue congue. Vestibulum facilisis non ante eget mollis."
  },
  {
    status: 1,
    title: "What is Lorem Ipsum?",
    due: new Date(),
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque suscipit urna quis purus congue congue. Vestibulum facilisis non ante eget mollis."
  },
  {
    status: 2,
    title: "What is Lorem Ipsum?",
    due: new Date(),
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque suscipit urna quis purus congue congue. Vestibulum facilisis non ante eget mollis."
  }
]

const MAX_SIZE = 120;
export class Upload extends Component {

  url = null
  state = {
    items: [],
    show: false,
    active: 0,
    file: null
  }

  componentDidMount() {
    this.setState({ items: test })
  }

  getStatus = status => {
    switch (status) {
      case 0:
        return "Missing";
      case 1:
        return "Uploaded";
      case 2:
        return "Submitted";
      default:
        return "Error";
    }
  }

  getDiff = date => "10 Days"
  setActive = active => this.setState({ active })
  click = key => this.setState({ active: key })

  send = el => {
    el.preventDefault();
    if (this.url) {
      window.URL.revokeObjectURL(this.url);
    }
    this.url = window.URL.createObjectURL(this.state.file);
    console.log(this.url);
    this.close();
  }

  close = () => {
    this.toggleModal(false);
    this.setState({ file: null });
  }

  handleFile = ({ target }) => {
    if (target.files.length === 0) {
      this.setState({ file: null });
    } else {
      const file = target.files[0];
      this.setState({
        file
      })
    }
  }

  itemMap = ({ status, title, description, due }) => {
    const statusText = this.getStatus(status);

    return <Fragment>
      <p className={`upload__item-status upload__item-status--${statusText.toLowerCase()}`}>{statusText}</p>
      <div className="upload__item-header">
        <h4 className="upload__item-title">{title}</h4>
        <span className="upload__item-label">
          <i className="upload__item-icon far fa-clock" />
          {this.getDiff(due)}
        </span>
      </div>
      <p className="upload__item-text">
        {description.length > MAX_SIZE ? description.slice(0, MAX_SIZE) + "..." : description}
      </p>
    </Fragment>
  }

  toggleModal = state => this.setState(({show}) => ({
    show: state? state: !show
  }))

  render() {
    const { items, active, show, file } = this.state;
    return <Page className='upload'>
      <div className="upload__container">
        <List block="upload" onClick={this.click} active={active} items={items} map={this.itemMap}>
          <h3 className="upload__upload-header">Templates</h3>
        </List>
      </div>
      <Section className="upload__page">
        <h1>Something</h1>
        <button type="button" onClick={this.toggleModal}>
          Upload File
        </button>
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