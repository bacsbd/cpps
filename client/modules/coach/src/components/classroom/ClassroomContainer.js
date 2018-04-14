import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Classroom from './Classroom.js';
import Notifications, {error, success} from 'react-notification-system-redux';

class ClassroomContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      students: [],
      classId: this.props.match.params.classId,
      coach: {},
      name: '',
      problemLists: [],
      loadingState: true,
      loadingMessage: '',
    };

    this.handleError = this.handleError.bind(this);
    this.notifySuccess = this.notifySuccess.bind(this);
    this.propagateToChild = this.propagateToChild.bind(this);
  }

  propagateToChild() {
    return {
      ...this.props,
      changeView: this.changeView,
      handleError: this.handleError,
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


  async componentWillMount() {
    const {classId} = this.props.match.params;
    try {
      let resp = await fetch(
        `/api/v1/classrooms/${classId}`, {
        credentials: 'same-origin',
      });
      resp = await resp.json();

      if (resp.status !== 200) throw resp;
      const userIds = resp.data.students.map((x)=>x._id);

      if (userIds.length) {
        const data = {
          classroomId: classId,
          userIds,
        };
        let ratingResp = await fetch(`/api/v1/ratings`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(data),
          credentials: 'same-origin',
        });
        ratingResp = await ratingResp.json();

        if (ratingResp.status !== 200) throw ratingResp;

        const userIdToRating = {};
        ratingResp.data.forEach((x)=>{
          userIdToRating[x.userId] = x.currentRating;
        });

        const students = resp.data.students;
        students.forEach((x)=>{
          x.currentRating = userIdToRating[x._id];
        });
      }

      let problemListResp = await fetch(`/api/v1/classrooms/${classId}/problemlists`, {
        credentials: 'same-origin',
      });
      problemListResp = await problemListResp.json();
      if (problemListResp.status !== 200) throw problemListResp;

      this.setState({
        students: resp.data.students,
        name: resp.data.name,
        coach: resp.data.coach,
        problemLists: problemListResp.data,
      });
    } catch (err) {
      return this.handleError(err);
    }
  }

  render() {
    return (
      <Classroom
        {...this.propagateToChild()}
        name={this.state.name}
        classId={this.state.classId}
        students={this.state.students}
        coach={this.state.coach}
        owner={this.state.coach._id === this.props.user.userId}
        problemLists={this.state.problemLists}
      />
    );
  }
}

ClassroomContainer.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      classId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  user: PropTypes.shape({
    userId: PropTypes.string.isRequired,
  }).isRequired,
};

function mapStateToProps(state) {
  return {
    user: state.user,
    notifications: state.notifications,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    showNotification(msg) {
      dispatch(msg);
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ClassroomContainer);
