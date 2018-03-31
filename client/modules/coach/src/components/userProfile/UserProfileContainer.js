import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Profile} from './Profile.js';
import qs from 'qs';
import Notifications, {error, success} from 'react-notification-system-redux';

class UserProfileContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: '',
      displayUser: {},
      classrooms: [],
      ojnames: [],
    };

    this.updateOjStats = this.updateOjStats.bind(this);
    this.handleError = this.handleError.bind(this);
    this.notifySuccess = this.notifySuccess.bind(this);
    this.propagateToChild = this.propagateToChild.bind(this);
  }

  propagateToChild() {
    return {
      updateOjStats: this.updateOjStats,
      handleError: this.handleError,
      notifySuccess: this.notifySuccess,
    };
  }

  handleError(err) {
    this.props.showNotification(error({
      title: 'Error',
      message: err.message,
      autoDismiss: 500,
    }));
    console.error(err);
  }

  notifySuccess(msg) {
    this.props.showNotification(success({
      title: 'Success',
      message: msg,
      autoDismiss: 10,
    }));
  }

  updateOjStats(newOjStats) {
    const displayUser = this.state.displayUser;
    this.setState({
      displayUser: {
        ...displayUser,
        ojStats: newOjStats,
      },
    });
  }

  async loadProfile(currentProps) {
    const {username} = currentProps.match.params;

    try {
      let resp = await fetch(`/api/v1/users/${username}`, {
        credentials: 'same-origin',
      });
      resp = await resp.json();

      if (resp.status !== 200) throw resp;
      const displayUser = resp.data;

      resp = await fetch(`/api/v1/users/${username}/root-stats`, {
        credentials: 'same-origin',
      });
      resp = await resp.json();
      const userRootStats = resp.data;
      displayUser.userRootStats = userRootStats;

      resp = await fetch(`/api/v1/users/username-userId/${username}`, {
        credentials: 'same-origin',
      });
      resp = await resp.json();
      const userId = resp.data;

      const query = {
        student: userId,
        select: '_id name coach',
        populate: ['coach', 'username'],
      };

      resp = await fetch(`/api/v1/classrooms?${qs.stringify(query)}`, {
        credentials: 'same-origin',
      });
      resp = await resp.json();
      const classrooms = resp.data;

      this.setState({
        displayUser,
        userId,
        classrooms,
      });
    } catch (err) {
      this.handleError(err);
    }
  }

  async componentWillMount() {
    await this.loadProfile(this.props);
  }

  async componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.username === this.props.match.params.username) return;
    this.loadProfile(nextProps);
  }

  render() {
    return (
      <div>
        <Notifications notifications={this.props.notifications}/>
      <Profile {...this.props}
        {...this.propagateToChild()}
        displayUser={this.state.displayUser}
        classrooms={this.state.classrooms}
      />
      </div>
    );
  }
}

UserProfileContainer.propTypes = {
  match: PropTypes.shape(),
};

function mapStateToProps(state) {
  return {
    notifications: state.notifications,
    user: state.user,
    ojnames: state.ojnames,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    showNotification(msg) {
      dispatch(msg);
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileContainer);
