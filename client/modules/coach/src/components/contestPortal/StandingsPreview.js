import React, {Component} from 'react';
import {Table, Modal, ModalHeader, ModalBody, ModalFooter,
Button} from 'reactstrap';
import PropTypes from 'prop-types';
import {asyncUsernameToUserId} from 'components/utility/index';
import {getNewRatings} from 'codeforces-rating-system';

export default class StandingsPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      standings: [],
      rawData: [],
    };
    this.formatStandings = this.formatStandings.bind(this);
  }

  async componentWillReceiveProps(nextProps) {
    const {rawData, classId} = nextProps;
    if (this.state.rawData === rawData) return;

    let standings = rawData.split('\n').filter((x)=> x);

    standings = await Promise.all(standings.map(async (s) => {
      const arr = s.split(',').map((x) => x.trim());
      const position = parseInt(arr[0], 10);
      const username = arr[1];
      let userId;
      let previousRating;
      try {
        userId = await asyncUsernameToUserId(username);
        const data = {
          classroomId: classId,
          userIds: [userId], // TODO: Reduce number of api calls
        };
        const ratingApi = `/api/v1/ratings`;
        let resp = await fetch(ratingApi, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(data),
          credentials: 'same-origin',
        });
        resp = await resp.json();
        if (resp.status === 200 || resp.status === 202) {
          previousRating = resp.data[0].currentRating;
        } else throw resp;
      } catch (err) {
        console.log(err);
      }
      if (previousRating === -1) previousRating = 1500;
      return {position, username, userId, previousRating};
    }));

    standings = getNewRatings(standings);
    this.setState({standings, rawData});
  }

  formatStandings() {
    const standings = this.state.standings;
    const tr = standings.map((s)=>{
      return (
        <tr key={s.username}>
          <td>{s.position}</td>
          <td>{s.username}</td>
          <td>{s.userId}</td>
          <td>{s.newRating}</td>
          <td>{s.previousRating}</td>
          <td>{s.delta}</td>
        </tr>
      );
    });
    return (
      <Table>
        <thead>
          <tr>
            <th>Position</th>
            <th>Username</th>
            <th>UserId</th>
            <th>New Rating</th>
            <th>Previous Rating</th>
            <th>Delta</th>
          </tr>
        </thead>
        <tbody>
          {tr}
        </tbody>
      </Table>
    );
  }

  render() {
    const {modalState, toggle, addStandings} = this.props;
    return (
      <Modal isOpen={modalState} toggle={toggle} className='modal-lg'>
        <ModalHeader>Standings Preview</ModalHeader>
        <ModalBody style={{
          overflowX: 'auto',
        }}>{this.formatStandings()}</ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={()=>{
            addStandings(this.state.standings);
          }}>
            Add Standings</Button>
          <Button color="secondary" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    );
  }
}
StandingsPreview.propTypes = {
  modalState: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  rawData: PropTypes.string.isRequired,
  classId: PropTypes.string.isRequired,
  addStandings: PropTypes.func.isRequired,
};
