import React, { Component, Fragment } from 'react';
import { List, Section } from '../components/dashboard';
import { Page } from '../containers';
import '../styles/pages/upload.scss';
import { Modal } from '../components';
import { request, upload, reduce, Authentication } from '../util';

export class Upload extends Component {

  state = {
    items: null,
    show: false,
    active: -1,
    file: null,
    newTemplate: false
  }

  constructor(props) {
    super(props);
    this.user = Authentication.getInstance().getUser();
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

    if (!this.unmounted) {
      this.setState({ items, active: items.length - 1 });
    }
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  getStatus = status => {
    if (status === undefined) {
      return 'Missing';
    } else if (status) {
      return 'Submitted';
    } else {
      return 'Uploaded';
    }
  }

  toggleModal = state => (
    this.setState(({show}) => ({
      show: state? state: !show
    }))
  )

  close = () => {
    this.toggleModal(false);
    this.setState({ file: null });
  }

  handleFile = ({ currentTarget }) => {
    this.setState({ file: currentTarget.files.length === 0? null: currentTarget.files[0] })
    currentTarget.value = '';
  }

  getDiff = date => {
    const now = new Date();
    const diff = now - new Date(date);
    const days = Math.floor(diff / 86400000); // milliseconds -> days

    switch (days) {
      case 0:
        return 'Today'
      case 1:
        return 'Yesterday'
      default:
        return `${days} Days ago`
    }
  }

  setActive = active => this.setState({ active })

  send = async el => {
    el.preventDefault();
    const { file, items, active } = this.state;
    const item = items[active];
    const body = new FormData();
    body.append("file", file);

    try {
      const res = await upload(
        `/submit/${item._id}`,
        body
      );
      item.submitted = res.submitted;
      item.date = res.date;
      this.setState({ items });
    } catch (err) {
      console.log(err);
    }
    this.close();
  }

  add = async el => {
    el.preventDefault();

    const { file } = this.state;
    const body = new FormData();
    body.append("file", file);

    try {
      const id = await upload(
        '/temp',
        body
      );
      
      const item = await request(`/temp/${id}`);
      delete item.filename;
      this.setState(({ items }) => ({
        items: (items.push(item), items),
        active: (items.length - 1),
        newTemplate: false
      }));
    } catch (err) {
      console.log(err);
    }
    this.close();
  }

  itemMap = ({ name, date, submitted }) => {
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
    </Fragment>
  }

  deleteTemplate = async el => {
    const {active, items} = this.state;
    let itemsCopy = items;
    try {
      await request(`/temp/${items[active]._id}`, 'DELETE');
      itemsCopy.splice(active, 1);
      this.setState({
        items: itemsCopy,
        active: 0
      });
    } catch(err){
      console.log(err);
    }
  }

  render() {
    const { items, active, show, file, newTemplate } = this.state;
    const item = active > -1? items[active]: null;
    return <Page className='upload'>
      <div className="upload__list">
        <List block="upload" onClick={this.setActive} active={active} items={items} map={this.itemMap}>
          <h3 className="upload__upload-header">Templates</h3>
          {
            this.user._sys? <button className="upload__add-btn" type="button" onClick={
              el => { this.setState({ newTemplate: true }); this.toggleModal(el) }
            }>
              <i className="upload__add-btn-icon fas fa-plus"/> Add Template
            </button>: null
          }
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
            <button className="upload__page-button" type="button" onClick={this.deleteTemplate}>
              Delete Template
            </button>
          </Fragment>:
          <div className="green__loader-wrap">
            <i className="green__loader fas fa-circle-notch"/>Loading...
          </div>
        }
      </Section>
      <Modal show={show} className="upload__modal" close={this.close}>
        <form onSubmit={newTemplate? this.add: this.send} className={`upload__form${file ? " upload__form--uploaded" : ""}`}>
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