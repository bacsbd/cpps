import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Table} from 'reactstrap';
import PropTypes from 'prop-types';
import {
    Row, Col, Button, UncontrolledDropdown, DropdownToggle, DropdownMenu,
    DropdownItem,
} from 'reactstrap';
import {LinkContainer} from 'react-router-bootstrap';

function SettingsList() {
  return (
    <UncontrolledDropdown>
     <DropdownToggle className='fa fa-lg fa-cog' color='light'></DropdownToggle>
     <DropdownMenu>
      <LinkContainer to='/coach/addClassroom'>
         <DropdownItem>
          <Button color='primary' className='btn-block'> Add Class </Button>
        </DropdownItem>
      </LinkContainer>
     </DropdownMenu>
   </UncontrolledDropdown>
 );
}

class ClasroomList extends Component {
  constructor(props) {
    super(props);

    this.getRows = this.getRows.bind(this);
  }

  getRows() {
    const classrooms = this.props.classrooms;
    const rows = classrooms.map((classroom, ind) => {
      const {_id, name} = classroom;
      return (
        <tr key={_id}>
          <td>{ind+1}</td>
          <td><Link to={`/classroom/${_id}`}>{name}</Link></td>
        </tr>
      );
    });
    return rows;
  }

  render() {
    const classroomTable = (
      <Table >
        <thead>
          <tr>
            <th>#</th>
            <th>Classroom</th>
          </tr>
        </thead>
        <tbody>
          { this.getRows() }
        </tbody>
      </Table>
    );

    return (
      <div>
        <Row>
          <Col>
            <h1>Classrooms</h1>
          </Col>
          <Col className='text-right'>
            <SettingsList/>
          </Col>
        </Row>

        <Row>
          <Col>
            {classroomTable}
          </Col>
        </Row>
      </div>
    );
  }
}

/** PropTypes */
ClasroomList.propTypes = {
  classrooms: PropTypes.array.isRequired,
};

export default ClasroomList;
