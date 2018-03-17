import React, {Component} from 'react';
import Loadable from 'react-loading-overlay';
import ProblemList from './ProblemList';
import {error as errorNotification} from 'react-notification-system-redux';

export default class ProblemListContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listDetails: [],
      loadingState: true,
      loadingMessage: 'Fetching data...',
    };
    this.addListToState = this.addListToState.bind(this);
  }

  addListToState(x) {
    this.setState({
      listDetails: [...this.state.listDetails, x],
    });
  }

  async componentDidMount() {
    const {user} = this.props;
    try {
      const api = `/api/v1/problemlists?createdBy=${user.userId}`;
      let resp = await fetch(api, {
        method: 'get',
        credentials: 'same-origin',
      });
      resp = await resp.json();
      if (resp.status !== 200) {
        throw resp;
      }
      this.setState({
        listDetails: resp.data,
      });
      return;
    } catch (err) {
      if (err.status) {
        this.props.showNotification(errorNotification({
          title: 'Error',
          message: err.message,
          autoDismiss: 500,
        }));
      }
      return console.error(err);
    } finally {
      this.setState({
        loadingState: false,
      });
    }
  }

  render() {
    return (
      <Loadable active={this.state.loadingState}
      spinner={true}
      text={this.state.loadingMessage || 'Please wait a moment...'}>
        <ProblemList
          {...this.props}
          problemLists={this.state.listDetails}
          addListToState={this.addListToState}
        />
      </Loadable>
    );
  }
}
