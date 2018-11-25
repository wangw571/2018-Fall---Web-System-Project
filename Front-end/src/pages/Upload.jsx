import React, { Component, Fragment } from 'react';
import { List, Section } from '../components/dashboard';
import { Page } from '../containers';
import '../styles/pages/upload.scss';
import { Modal } from '../components';
import { request, reduce, Authentication } from '../util';
import { Table, File, TemplateDetails } from '../components/upload';
import { toast } from 'react-toastify';

const STATUS = {
  undefined: 'Missing',
  false: 'Uploaded',
  true: 'Submitted'
};
export class Upload extends Component {

  state = {
    items: null,
    show: false,
    data: null,
    details: false,
    active: -1
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
      toast.error("Error getting templates/submissions");
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
      this.setState({ items, active: 0 });
    }
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  toggleModal = state => (
    this.setState(({show}) => ({
      show: state? state: !show,
      details: false
    }))
  )

  close = () => this.setState({ show: false })

  getDiff = date => {
    const now = new Date();
    const diff = now - new Date(date);
    const days = Math.floor(diff / 86400000); // milliseconds -> days

    switch (days) {
      case 0: return 'Today'
      case 1: return 'Yesterday'
      default: return `${days} Days ago`
    }
  }

  modify = async () => {
    this.toggleModal();
    this.setState({ details: true });
  }
  save = async () => {
    const { items, active, data } = this.state;
    const item = items[active];
    item.date = new Date();
    try {
      await request(`/submit/${item._id}`, 'PATCH', {
        submitted: item.submitted, date: item.date, data
      });
      this.setState({ items });
      toast("Submission successfully updated");
    } catch (err) {
      console.log(err);
      toast.error("Error updating submissions");
    }
  }
  delete = async () => {
    const { items, active } = this.state;
    const item = items[active];
    try {
      await request(`/submit/${item._id}`, 'DELETE');
      delete item.submitted
      item.date = new Date();
      this.setState({ items });
      toast("Submission successfully deleted");
    } catch (err) {
      console.log(err);
      toast.error("Error removing submissions");
    }
  }
  submit = async () => {
    const { items, active } = this.state;
    items[active].submitted = true;
    this.setState({ items });
    await this.save();
  }

  setData = async data => this.setState(data)
  setActive = async active => this.setState({ active })
  send = item => this.setState(({ items, active }) => {
    items[active].submitted = item.submitted;
    items[active].date = item.date;
    return items;
  });

  add = async _id => {
    const item = await request(`/temp/${_id}`);
    delete item.filename;
    if (!this.unmounted) {
      this.setState(({ items }) => ({
        items: (items.push(item), items),
        active: items.length - 1,
        show: false
      }))
    }
    toast("Template successfully added");
  }

  itemMap = ({ name, date, submitted }) => {
    const statusText = STATUS[submitted];
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
      toast("Template successfully deleted");
    } catch(err){
      console.log(err);
      toast.error("Error removing tempalte");
    }
  }

  render() {
    const { items, active, show, details } = this.state;
    const item = active > -1? items[active]: null;

    return <Page className='upload'>
      <div className="upload__list">
        <List block="upload" onClick={this.setActive} active={active} items={items} map={this.itemMap}>
          <h3 className="upload__upload-header">Templates</h3>
          {
            this.user._sys?
            <button className="upload__button" type="button" onClick={this.toggleModal}>
              <i className="upload__button-icon fas fa-plus"/> Add Template
            </button>:null
          }
        </List>
      </div>
      <Section className="upload__page">
        {
          item?
          <Fragment>
            <h1 className="upload__page-title">{ item.name }</h1>
            {
              item.submitted === undefined?
              <Fragment>
                {
                  !this.user._sys? null:
                  <div className="upload__controls">
                    <button className="upload__button upload__button--controls" onClick={this.modify} type="button">Modify</button>
                  </div>
                }
                <File submit={this.send} id={item._id}/>
              </Fragment>:
              <Fragment>
                <h2 className="upload__page-subtitle">Submission Details</h2>
                <div className="upload__controls">
                  {
                    item.submitted? null:
                    <Fragment>
                      <button className="upload__button upload__button--controls" onClick={this.submit} type="button">Submit</button>
                      <button className="upload__button upload__button--controls" onClick={this.save} type="button">Save</button>
                    </Fragment>
                  }
                  { this.user._sys? <button className="upload__button upload__button--controls" onClick={this.modify} type="button">Modify</button>: null }
                  <button className="upload__button upload__button--controls" onClick={this.delete} type="button">Delete</button>
                </div>
                <Table items={items} active={active} set={this.setData} disabled={item.submitted}/>
              </Fragment>
            }
          </Fragment>:
          items? null:
          <div className="green__loader-wrap">
            <i className="green__loader fas fa-circle-notch"/>Loading...
          </div>
        }
      </Section>
      <Modal show={show} className="upload__modal" close={this.close}>
        {
          details? <TemplateDetails close={this.close} items={items} active={active} set={this.setData}/>:
          <File className="upload__file" submit={this.add} buttons={() => 
            <button className="file__button file__button--exit green__button" type="button" onClick={this.close}>Exit</button>
          }/>
        }
      </Modal>
    </Page>
  }
}