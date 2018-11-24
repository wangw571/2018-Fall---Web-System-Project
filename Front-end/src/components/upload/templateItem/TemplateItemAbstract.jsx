import React, { PureComponent, Fragment } from 'react';
import '../../../styles/components/upload/template.scss';
import { Switch } from '../..';
import { COLUMN_TYPES } from '../../../values';

export class TemplateItemAbstract extends PureComponent {
  state = {
    name: '',
    required: false,
    type: 'text'
  }

  componentDidMount() {
    const { item } = this.props;
    if (item) {
      const { name, required, type } = item;
      this.setState({ name, required, type });
    }
  }

  update = async ({ currentTarget }) => {
    const name = currentTarget.name;
    const { item, set, active } = this.props;
    const state = this.state;
    switch (name) {
      case 'type':
        state.type = COLUMN_TYPES[currentTarget.value];
        await this.setOptions(state);
        break;
      case 'required':
        state.required = currentTarget.checked;
        break;
      default:
        state.name = currentTarget.value;
        break;
    }
    this.setState(state);
    set(active, { ...item, ...state });
  }

  setOptions = async item => {
    switch(item.type) {
      case COLUMN_TYPES[0]: return item.options = ''
      case COLUMN_TYPES[1]: return item.options = [0, 0]
      case COLUMN_TYPES[2]: return item.options = []
      case COLUMN_TYPES[3]: return item.options = []
      default: return null
    }
  }

  render() {
    const { name, required, type } = this.state;
    return <Fragment>
      <div className="green__input-group">
        <label className="green__input-label" htmlFor="name">Name of Column</label>
        <input
          type="text" name="name" className="green__input" value={name} onChange={this.update}
        />
      </div>
      <div className="green__input-group">
        <label className="green__input-label" htmlFor="required">Required?</label>
        <Switch className="upload" name="required" value={required} onChange={this.update}/>
      </div>
      <div className="green__input-group">
        <label className="green__input-label" htmlFor="type">Type</label>
        <select className="green__input green__input--select" name="type" value={COLUMN_TYPES.indexOf(type)} onChange={this.update}>
          {
            COLUMN_TYPES.map((item, key) => <option key={key} value={key}>
              { item.slice(0, 1).toUpperCase() + item.slice(1) }
            </option>)
          }
        </select>
      </div>
    </Fragment>
  }
}