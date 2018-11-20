import React, { Component, Fragment } from 'react';
import { List, Section } from '../components/dashboard';
import { Page } from '../containers';
import '../styles/pages/upload.scss';
import { Modal } from '../components';
import { request, upload, reduce, Authentication } from '../util';

const user = Authentication.getInstance().getUser();
export class Upload extends Component {

  state = {
    items: null,
    show: false,
    active: -1,
    file: null,
    newTemplate: false,
    currentData: []
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
      this.setState({ items, active: 0 });
    }
  }

  componentWillUnmount() {
    this.unmounted = true;
    console.log("test");
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

  setActive = async active => {
    const {items} = this.state;
    let data = null;
    let temp = null;
    try {
      data = await request(`/submit/${items[active]._id}`);
      temp = await request(`/temp/${items[active]._id}`);
      console.log(items[active]._id);
      console.log(data.data[0]);
      let updateData = data.data;
      console.log(updateData.length);
      console.log(Math.max(...Object.keys(temp.columns)));
      let maxCols = Math.max(...Object.keys(temp.columns));

      let i=0;
      let j=0;
      let columns = {};
      columns['id'] = 0;
      for (i=0; i<=maxCols; i++){
        columns[i] = temp.columns[i].name;
      }
      console.log(updateData);
      for (j=0; j<updateData.length; j++){
        updateData[j]['id'] = j+1;
        for (i=0; i<=maxCols; i++){
          if (!updateData[j].hasOwnProperty(i)){
              updateData[j][i] = "Empty";
          }
        }
      }
      console.log(columns);
      console.log(updateData);
      let finalData = new Array(columns);
      finalData = finalData.concat(updateData);
      console.log(finalData);
      this.setState({
        currentData: finalData
      });
    } catch (err){
      console.log(err);
      this.setState({
        currentData: []
      });
    }
    this.setState({
      active
    });
  }

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

  editValue = (row,cols,e) => {
    let inputValue = e.target.innerText;
    let newRow = row.row;
    let newRowNum = newRow.id;
    let position = cols.cols;
    newRow[position] = inputValue;
    let copy = this.state.currentData;
    copy[newRowNum] = newRow;
    console.log(row.id);
  
    console.log(inputValue);
    console.log(newRow);
    console.log(newRowNum);
    console.log(position);
    console.log(copy);
    this.setState({
        currentData: copy
    });
  }

  editSubmission = async el => {
    el.preventDefault();
    console.log("hello");
    const {active, currentData, items} = this.state;
    console.log(currentData.slice(1));
    try {
      await request(`/submit/${items[active]._id}`, 'POST', currentData.slice(1));
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const { items, active, show, file, newTemplate } = this.state;
    console.log(items);
    const item = active > -1? items[active]: null;
    let data = null;
    if (this.state.currentData.length > 0){
      data = this.state.currentData.map(row =>{
        return (
            <tr key={row.id}>
                {Object.keys(row).filter(cols => cols !== 'id').map(cols => {
                    return (
                      <td key={row.id+''+ cols}>
                        <div contentEditable="true"
                        value={cols} 
                        onInput={this.editValue.bind(this,{row},{cols})}
                        >
                          {row[cols]}
                        </div>
                    </td>);
                })}
            </tr>
        );
      });
    }
    return <Page className='upload'>
      <div className="upload__list">
        <List block="upload" onClick={this.setActive} active={active} items={items} map={this.itemMap}>
          <h3 className="upload__upload-header">Templates</h3>
          {
            user._sys? <button className="upload__add-btn" type="button" onClick={
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
              <form onSubmit={this.editSubmission}>
                <div>
                  <table cellSpacing="50" id="mytable">
                    <tbody>{data}</tbody>
                  </table>
                </div>
                <button>
                 Edit Submission
                </button>
              </form>
            
          </Fragment>:
 
          null
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