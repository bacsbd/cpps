import React, {Component} from 'react';
import {connect} from 'react-redux';
import Notifications, {error}
  from 'react-notification-system-redux';
import Loadable from 'react-loading-overlay';
import {LinkContainer} from 'react-router-bootstrap';
import PropTypes from 'prop-types';

class Template extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loadingState: true,
      loadingMessage: '',
    };

    this.handleError = this.handleError.bind(this);
  }

  handleError(err) {
    if (err.status) {
      this.props.showNotification(error({
        title: 'Error',
        message: err.message,
        autoDismiss: 500,
      }));
    }
    console.error(err);
  }

  async componentWillMount() {
    const {problemListId} = this.props.match.params;
    const {user} = this.props;
    try {
      let resp = await fetch(`/api/v1/problemlists/${problemListId}`, {
        method: 'GET',
        credentials: 'same-origin',
      });
      resp = await resp.json();
      if (resp.status !== 200) throw resp;
    } catch (err) {
      this.handleError(err);
    } finally {
      this.setState({
        loadingState: false,
      });
    }
  }

  render() {
    return (
      <Loadable active={this.state.loadingState} spinner={true}
      text={this.state.loadingMessage || 'Please wait a moment...'}>
        <Notifications notifications={this.props.notifications}/>
      </Loadable>
    );
  }
}

Template.propTypes = {
  showNotification: PropTypes.func.isRequired,
  notifications: PropTypes.shape(),
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

export default connect(mapStateToProps, mapDispatchToProps)(Template);
