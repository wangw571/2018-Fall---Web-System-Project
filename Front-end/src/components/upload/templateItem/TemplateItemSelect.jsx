import React, { PureComponent } from 'react';
import '../../../styles/components/upload/template.scss';
import { TemplateItemAbstract } from './TemplateItemAbstract';

export class TemplateItemSelect extends PureComponent {

  state = {
    options: []
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
    const options = value.split('\n').map(item => item.trim());
    this.setState({ options });
    set(active, (item.options = options, item));
  }

  expand = options => options.reduce((str, opt) => str += `${opt}\n`, "").slice(0, -1)

  render() {
    const { options } = this.state;
    const { set, item, active } = this.props;
    return <li className="upload__temp-item">
      <TemplateItemAbstract set={set} item={item} active={active} />
      <div className="green__input-group">
        <label className="green__input-label" htmlFor="max">Options</label>
        <textarea rows={5} className="green__input green__input--group" value={this.expand(options)} onChange={this.update}/>
      </div>
    </li>
  }
}