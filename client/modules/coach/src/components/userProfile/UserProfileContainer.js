import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Profile} from './Profile.js';
import qs from 'qs';
import Notifications from 'react-notification-system-redux';

function mapStateToProps(state) {
  return {
    notifications: state.notifications,
    user: state.user,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    showNotification(msg) {
      dispatch(msg);
    },
  };
}

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
      if (err.status) alert(err.message);
      console.log(err);
    }
  }

  async componentWillMount() {
    await this.loadProfile(this.props);
  }

  async componentWillReceiveProps(nextProps) {
    if (nextProps === this.props) return;
    this.loadProfile(nextProps);
  }

  render() {
    const {notifications} = this.props;
    return (
      <div>
        <Notifications
        notifications={notifications}
      />
      <Profile {...this.props}
        displayUser={this.state.displayUser}
        classrooms={this.state.classrooms}
        updateOjStats={this.updateOjStats}
      />
      </div>
    );
  }
}

UserProfileContainer.propTypes = {
  match: PropTypes.shape(),
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileContainer);
