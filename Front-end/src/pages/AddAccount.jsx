import React, { Component } from 'react';
import '../styles/containers/addAccount.scss';
import { withRouter } from 'react-router-dom';
import { Page } from '../containers';

class _AddAccount extends Component {

  render() {
    return (
        <Page className="addAccount">
            Add Account Page
            <form>
                <input
                className="addAccount__username"
                placeholder="Username"
                type="text">
                </input>

                <input
                className="addAccount__input"
                placeholder="Password"
                type="text">
                
                </input>

                <input 
                className="addAccount__input"
                placeholder="Email"
                type="text">
                </input>
                <button className="addAccount__button">
                    Register
                </button>
            </form>
        </Page>
    )
  }
}

export const AddAccount = withRouter(_AddAccount);
