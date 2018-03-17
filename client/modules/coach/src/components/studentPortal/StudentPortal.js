import React from 'react';
import {LinkContainer} from 'react-router-bootstrap';
import {
    Table, Row, Col, Button, UncontrolledDropdown, DropdownToggle, DropdownMenu,
    DropdownItem,
} from 'reactstrap';
import PropTypes from 'prop-types';
import ProgressButton from 'react-progress-button';
import {success} from 'react-notification-system-redux';

/** Setting List */

function SettingsList({classId, name}) {
  return (
    <UncontrolledDropdown>
     <DropdownToggle className='fa fa-lg fa-cog' color='light'></DropdownToggle>
     <DropdownMenu>

      <LinkContainer to={`/classroom/${classId}/addStudent`}>
        <DropdownItem>
           <Button color='primary' className='btn-block'> Add Student </Button>
        </DropdownItem>
      </LinkContainer>

      <LinkContainer to={`/classroom/${classId}/removeStudent`}>
        <DropdownItem>
          <Button color='danger' className='btn-block'>Remove Student</Button>
        </DropdownItem>
      </LinkContainer>

     </DropdownMenu>
   </UncontrolledDropdown>
 );
}

SettingsList.propTypes = {
  classId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

/** Student List */

async function syncAll(students, props) {
  const usernames = students.map((s)=>s.username);

  for (let username of usernames) {
    try {
      let resp = await fetch(`/api/v1/users/${username}/sync-solve-count`, {
        method: 'PUT',
        credentials: 'same-origin',
      });
      resp = await resp.json();
      if (resp.status !== 202) throw resp;
    } catch (err) {
      console.error(`Error synching user: ${username}`, err);
    }
  }
  props.showNotification(success({
    title: 'Request Receieved',
    message: 'Please wait while we process your request',
    position: 'tr',
    autoDismiss: 5,
  }));
}

function StudentPortal(props) {
  const {students, classId, name, owner} = props;
  students.sort((a, b)=>{
    return b.currentRating - a.currentRating;
  });
  let tabulatedStudentsList = students.map((s, ind) => (
    <tr key={s._id}>
      <td>{ind + 1}</td>
      <td>
        <LinkContainer to={`/users/profile/${s.username}`}>
          <a>
            {s.username}
          </a>
        </LinkContainer>
      </td>
      <td>{s.currentRating}</td>
    </tr>
  ));
  return (
    <div className='text-center'>
      <Row>
        <Col>
          <h2>Student Portal</h2>
        </Col>
        {
          owner?
          <Col className='text-right'>
            <SettingsList classId={classId} name={name}/>
          </Col>:
          <span></span>
        }
      </Row>
      <Row className="mb-1">
        <Col>
          <LinkContainer to={`/classroom/${classId}/leaderboard`}>
            <Button color="primary">Leaderboard</Button>
          </LinkContainer>
        </Col>
        <Col>
          {
            owner?
            <ProgressButton
                className="ml-1"
                onClick={()=>syncAll(students, props)}
                >
              Sync All
            </ProgressButton>: ''
          }
        </Col>
      </Row>
      <Table>
        <thead>
          <tr>
            <th> Index </th>
            <th> Username </th>
            <th> Rating </th>
          </tr>
        </thead>
        <tbody>
          { tabulatedStudentsList }
        </tbody>
      </Table>
    </div>
  );
}

StudentPortal.propTypes = {
  classId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  students: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
  })).isRequired,
  owner: PropTypes.bool.isRequired,
};

export default StudentPortal;
