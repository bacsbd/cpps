import React from 'react';
import {LinkContainer} from 'react-router-bootstrap';
import {
  Table,
  Row,
  Col,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import PropTypes from 'prop-types';

/** Setting List */

async function applyRating(contestId) {
  try {
    const api = `/api/v1/ratings/apply/contest/${contestId}`;
    let resp = await fetch(api, {
      method: 'PUT',
      credentials: 'same-origin',
    });
    resp = await resp.json();
    if (resp.status !== 200) throw resp;
    alert('Successfully updated ratings');
  } catch (err) {
    if (err.status) alert(err.message);
    console.log(err);
  }
}

function SettingsList({contestId, classId, deleteStandings}) {
  return (
    <UncontrolledDropdown>
      <DropdownToggle className="fa fa-lg fa-cog" color="light" />
      <DropdownMenu>
        <DropdownItem>
          <div
            className="btn btn-block btn-primary"
            onClick={() => applyRating(contestId)}
          >
            Apply Rating{' '}
          </div>
        </DropdownItem>

        <LinkContainer
          to={`/classroom/${classId}/contest/${contestId}/add-standings`}
        >
          <DropdownItem>
            <div className="btn btn-block btn-primary">Add Standings</div>
          </DropdownItem>
        </LinkContainer>

        <DropdownItem>
          <div
            className="btn btn-block btn-danger"
            onClick={() => deleteStandings(contestId)}
          >
            Delete Standings
          </div>
        </DropdownItem>

        {/* <LinkContainer to={`/classroom/${classId}/contest/add-contest`}>
        <DropdownItem>
           <Button color='danger' className='btn-block'>
            Rollback Rating </Button>
        </DropdownItem>
      </LinkContainer> */}
      </DropdownMenu>
    </UncontrolledDropdown>
  );
}

SettingsList.propTypes = {
  contestId: PropTypes.string.isRequired,
  classId: PropTypes.string.isRequired,
  deleteStandings: PropTypes.func.isRequired,
};

/** Standings List */

function SingleContest(props) {
  const {contestId, contest, data, deleteStandings, classId, owner} = props;
  let tabulatedContestList = data.map((s, ind) => (
    <tr key={s._id}>
      <td>{ind + 1}</td>
      <td>{s.position}</td>
      <td>{s.username}</td>
      <td>{s.previousRating}</td>
      <td>{s.newRating}</td>
      <td>{s.newRating - s.previousRating}</td>
    </tr>
  ));

  return (
    <div className="text-center">
      <Row>
        <Col>
          <h1>
            Contest Details: <a href={contest.link}>{contest.name}</a>
          </h1>
        </Col>
        <Col className="text-right">
          {owner ? (
            <SettingsList
              contestId={contestId}
              classId={classId}
              deleteStandings={deleteStandings}
            />
          ) : (
            <span />
          )}
        </Col>
      </Row>
      <Table>
        <thead>
          <tr>
            <th> # </th>
            <th> Position </th>
            <th> Username </th>
            <th> Previous Rating </th>
            <th> New Rating </th>
            <th> Delta </th>
          </tr>
        </thead>
        <tbody>{tabulatedContestList}</tbody>
      </Table>
    </div>
  );
}

SingleContest.propTypes = {
  classId: PropTypes.string.isRequired,
  contestId: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      userId: PropTypes.string.isRequired,
      position: PropTypes.number.isRequired,
      previousRating: PropTypes.number.isRequired,
      newRating: PropTypes.number.isRequired,
    })
  ).isRequired,
  deleteStandings: PropTypes.func.isRequired,
  owner: PropTypes.bool.isRequired,
  contest: PropTypes.object.isRequired,
};

export default SingleContest;
