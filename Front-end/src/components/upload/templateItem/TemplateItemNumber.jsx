import React, { PureComponent } from 'react';
import '../../../styles/components/upload/template.scss';
import { TemplateItemAbstract } from './TemplateItemAbstract';

export class TemplateItemNumber extends PureComponent {

  state = {
    max: 0,
    min: 0
  }

  componentDidMount() {
    const { item } = this.props;
    if (item) {
      const { options } = item;
      this.setState({ options });
    }
  }

  update = async ({ currentTarget }) => {
    const name = currentTarget.name;
    const { item, active, set } = this.props;
    const data = { ...this.state, [name]: currentTarget.value };
    this.setState(data);
    set(active, (item.options = data, item));
  }

  render() {
    const { max, min } = this.state;
    const { set, item, active } = this.props;
    return <li className="upload__temp-item">
      <TemplateItemAbstract set={set} active={active} item={item} />
      <div className="green__input-group">
        <label className="green__input-label" htmlFor="max">Max value</label>
        <input
          type="number" name="max" className="green__input" value={max} onChange={this.update}
        />
      </div>
      <div className="green__input-group">
        <label className="green__input-label" htmlFor="min">Min value</label>
        <input
          type="number" name="min" className="green__input" value={min} onChange={this.update}
        />
      </div>
    </li>
  }
}