import React from 'react';
import {Link} from 'react-router-dom';
import {LinkContainer} from 'react-router-bootstrap';
import {
    Table, Row, Col, Button, UncontrolledDropdown, DropdownToggle, DropdownMenu,
    DropdownItem,
} from 'reactstrap';
import PropTypes from 'prop-types';

/** Setting List */

function SettingsList({classId}) {
  return (
    <UncontrolledDropdown>
     <DropdownToggle className='fa fa-lg fa-cog' color='light'></DropdownToggle>
     <DropdownMenu>

      <LinkContainer to={`/classroom/${classId}/contest/add-contest`}>
        <DropdownItem>
           <Button color='primary' className='btn-block'> Add Contest </Button>
        </DropdownItem>
      </LinkContainer>

     </DropdownMenu>
   </UncontrolledDropdown>
 );
}

SettingsList.propTypes = {
  classId: PropTypes.string.isRequired,
};

/** Contest List */

function ContestPortal(props) {
  const {classId, data, owner} = props;
  let tabulatedContestList = data.map((s, ind) => (
    <tr key={s._id}>
      <td>{ind + 1}</td>
      <td>
        <Link to={`/classroom/${classId}/contest/${s._id}`}> {s.name} </Link>
      </td>
    </tr>
  ));
  return (
    <div className='text-center'>
      <Row>
        <Col>
          <h2>Contest Portal</h2>
        </Col>
        {
          owner?
          <Col className='text-right'>
            <SettingsList classId={classId}/>
          </Col>:
          <span></span>
        }
      </Row>
      <Table>
        <thead>
          <tr>
            <th> Index </th>
            <th> Contest </th>
          </tr>
        </thead>
        <tbody>
          { tabulatedContestList }
        </tbody>
      </Table>
    </div>
  );
}

ContestPortal.propTypes = {
  classId: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  owner: PropTypes.bool.isRequired,
};

export default ContestPortal;
