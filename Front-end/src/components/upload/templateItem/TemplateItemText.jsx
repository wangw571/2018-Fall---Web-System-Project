import React, { PureComponent } from 'react';
import '../../../styles/components/upload/template.scss';
import { TemplateItemAbstract } from './TemplateItemAbstract';

export class TemplateItemText extends PureComponent {

  state = {
    options: ""
  }

  componentDidMount() {
    const { item } = this.props;
    if (item) {
      const { options } = item;
      this.setState({ options });
    }
  }

  update = async ({ currentTarget }) => {
    const value = currentTarget.value;
    const { item, active, set } = this.props;
    this.setState({ options: value });
    set(active, (item.options = value, item));
  }

  render() {
    const { options } = this.state;
    const { set, item, active } = this.props;
    return <li className="upload__temp-item">
      <TemplateItemAbstract set={set} item={item} active={active} />
      <div className="green__input-group">
        <label className="green__input-label" htmlFor="regex">Regex</label>
        <input
          type="text" name="regex" className="green__input" value={options} onChange={this.update}
        />
      </div>
    </li>
  }
}