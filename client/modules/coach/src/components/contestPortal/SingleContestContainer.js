import React, {Component} from 'react';
import PropTypes from 'prop-types';
import SingleContest from './SingleContest.js';
import {connect} from 'react-redux';

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

class SingleContestContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [], // Array of standings
      coach: '',
      contest: {},
    };

    this.deleteStandings = this.deleteStandings.bind(this);
  }

  async deleteStandings(contestId) {
    try {
      const api = `/api/v1/contests/${contestId}`;
      let resp = await fetch(api, {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      resp = await resp.json();
      if (resp.status !== 200) throw resp;
      alert('All standings have been removed');
      this.setState({data: []});
    } catch (err) {
      if (err.status) alert(err.message);
      console.log(err);
    }
  }

  async componentWillMount() {
    const {classId, contestId} = this.props.match.params;
    try {
      let resp = await fetch(`/api/v1/standings?contestId=${contestId}`, {
        credentials: 'same-origin',
      });
      resp = await resp.json();

      if (resp.status !== 200) throw resp;

      let resp2 = await fetch(`/api/v1/classrooms/${classId}`, {
        credentials: 'same-origin',
      });
      resp2 = await resp2.json();

      let resp3 = await fetch(`/api/v1/contests/${contestId}`, {
        credentials: 'same-origin',
      });
      resp3 = await resp3.json();

      this.setState({
        data: resp.data,
        coach: resp2.data.coach._id,
        contest: resp3.data,
      });
    } catch (err) {
      if (err.status) alert(err.message);
      else console.log(err);
    }
  }

  render() {
    const {classId, contestId} = this.props.match.params;
    const userId = this.props.user.userId;
    return (
      <SingleContest
        classId={classId}
        contestId={contestId}
        contest={this.state.contest}
        data={this.state.data}
        deleteStandings={this.deleteStandings}
        owner={this.state.coach.toString() === userId.toString()}
      />
    );
  }
}

SingleContestContainer.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      contestId: PropTypes.string.isRequired,
      classId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  user: PropTypes.shape({
    userId: PropTypes.string.isRequired,
  }),
};

export default connect(mapStateToProps)(SingleContestContainer);
