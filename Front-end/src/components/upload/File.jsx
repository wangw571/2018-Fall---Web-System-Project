import React, { Component } from 'react';
import { upload } from '../../util';
import '../../styles/components/upload/file.scss';

export class File extends Component {

  state = { file: null }

  submit = async el => {
    el.preventDefault();
    const { file } = this.state;
    const { id, submit } = this.props;
    const body = new FormData();
    body.append("file", file);

    try {
      const res = await upload(
        id? `/submit/${id}`: '/temp',
        body
      );
      submit(res);
    } catch (err) {
      console.log(err);
    }
    if (!this.unmounted) {
      this.setState({ file: null });
    }
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  handleFile = async ({ currentTarget }) => {
    if (!this.unmounted) {
      this.setState({ file: currentTarget.files.length === 0? null: currentTarget.files[0] });
    }
    currentTarget.value = '';
  }

  render() {
    const { file } = this.state;
    const { buttons, className } = this.props;
    const name = `file${file ? " file--uploaded" : ""}${className? ` ${className}`: ""}`;
    return <form onSubmit={this.submit} className={name}>
      <div className="file__drop">
        <input onChange={this.handleFile} className="file__input" type="file"/>
        <i className="file__icon fas fa-cloud-upload-alt" />
        <p className="file__header">{ file? "Uploaded": "Drag and drop or click here" }</p>
        <p className="file__subheader">{ file? file.name: "to upload your iCare" }</p>
      </div>
      <div className="file__button-wrapper">
        <button className="file__button green__button" type="submit" disabled={!file}>Submit</button>
        { buttons? buttons(): null }
      </div>
    </form>
  }
}