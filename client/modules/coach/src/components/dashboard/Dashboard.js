import React, {Component} from 'react';
import {Row, Col} from 'reactstrap';
import {connect} from 'react-redux';
import Notifications from 'react-notification-system-redux';

import ClassroomListContainer from './ClassroomListContainer';
import ProblemListContainer from './ProblemListContainer';

class Dashboard extends Component {
  render() {
    return (
      <div>
        <Notifications
        notifications={this.props.notifications}
        />
        <Row>
          <Col>
            <ClassroomListContainer {...this.props}/>
          </Col>
          <Col>
            <ProblemListContainer {...this.props}/>
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
