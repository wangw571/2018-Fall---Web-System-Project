import React, { Component } from 'react';
import '../../styles/components/upload/template.scss';
import { TemplateItem, TemplateItemNumber, TemplateItemSelect, TemplateItemText } from './templateItem';
import { request } from '../../util';
import { COLUMN_TYPES } from '../../values';

export class TemplateDetails extends Component {

  state = {
    name: "",
    columns: null
  }

  async componentDidMount() {
    const { items, active } = this.props;
    if (items && active != null) {
      const item = items[active];
      try {
        const { name, columns } = await request(`/temp/${item._id}`);
        this.setState({ name, columns });
      } catch (err) {
        console.log(err);
      }
    }
  }

  delete = async () => {
    const { items, active, set } = this.props;
    try {
      await request(`/temp/${items[active]._id}`, 'DELETE');
      items.splice(active, 1);
      set({ items, active: -1, show: false });
    } catch (err) {
      console.log(err);
    }
  }
  
  submit = async el => {
    el.preventDefault();
    const { items, active, set } = this.props;
    try {
      const res = await request(`/temp/${items[active]._id}`, 'POST', this.state);
      items[active] = res;
      set({ items, show: false });
    } catch (err) {
      console.log(err);
    }
  }

  update = async ({ currentTarget }) => this.setState({ name: currentTarget.value })
  set = async (index, data) => this.setState(({ columns }) => {
    columns[index] = data;
    return { columns };
  })
  render () {
    const { name, columns } = this.state;
    const { items, active, close } = this.props;
    const item = items[active]? items[active]: null;
    return columns && item?
      <form className="upload__temp" onSubmit={this.submit}>
        <h2>Template Details</h2>
        <p className="upload__temp-id"><strong>Template id:</strong> { item._id }</p>
        <div className="upload__controls">
          <button className="upload__button upload__button--controls" type="submit">Submit</button>
          <button className="upload__button upload__button--controls" type="button" onClick={this.delete}>Delete</button>
          <button className="upload__button upload__button--controls" type="button" onClick={close}>Exit</button>
        </div>
        <div className="green__input-group">
          <label className="green__input-label" htmlFor="name">Name of Template</label>
          <input
            type="text" name="name" className="green__input" value={name} onChange={this.update}
          />
        </div>

        <h3>Columns</h3>
        <ul className="upload__temp-items">
          {
            columns.map((item, key) => {
              switch(item.type) {
                case COLUMN_TYPES[0]: return <TemplateItemText set={this.set} active={key} item={item} key={key}/>
                case COLUMN_TYPES[1]: return <TemplateItemNumber set={this.set} active={key} item={item} key={key}/>
                case COLUMN_TYPES[2]: return <TemplateItemSelect set={this.set} active={key} item={item} key={key}/>
                case COLUMN_TYPES[3]: return <TemplateItem set={this.set} active={key} item={item} key={key}/>
                default: return null
              }
            })
          }
        </ul>
      </form>:
      <div className="green__loader-wrap">
        <i className="green__loader fas fa-circle-notch"/>Loading...
      </div>
    ;
  }
}