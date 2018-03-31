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
    this.notifySuccess = this.notifySuccess.bind(this);
    this.propagateToChild = this.propagateToChild.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  propagateToChild() {
    return {
      changeView: this.changeView,
    };
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    ...
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

  async componentWillMount() {
    const {problemListId} = this.props.match.params;
    const {user} = this.props;
    try {
      let resp = await fetch(`/api/v1/problemlists/${problemListId}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({}),
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
