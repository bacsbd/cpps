import React, {Component} from 'react';
import {Row, Col} from 'reactstrap';
import {connect} from 'react-redux';
import Notifications, {error, success} from 'react-notification-system-redux';

import ClassroomListContainer from './ClassroomListContainer';
import ProblemListContainer from './ProblemListContainer';

class Dashboard extends Component {
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


  propagateToChild() {
    return {
      ...this.props,
      changeView: this.changeView,
      handleError: this.handleError,
    };
  }

  render() {
    return (
      <div>
        <Notifications
        notifications={this.props.notifications}
        />
        <Row>
          <Col>
            <ClassroomListContainer {...this.propagateToChild()}/>
          </Col>
          <Col>
            <ProblemListContainer {...this.propagateToChild()}/>
          </Col>
        </Row>
      </div>
    );
  }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
