import React, {Component} from 'react';
import {LinkContainer} from 'react-router-bootstrap';
import {
    Row, Col, Button, UncontrolledDropdown, DropdownToggle, DropdownMenu,
    DropdownItem,
} from 'reactstrap';
import PropTypes from 'prop-types';
import StudentPortal from 'components/studentPortal/StudentPortal';
import ContestPortalContainer from
  'components/contestPortal/ContestPortalContainer';
import Notifications, {error} from 'react-notification-system-redux';
import {ProblemListClassroom} from './ProblemListClassroom';

/** Setting List */

function SettingsList({classId, name}) {
  return (
    <UncontrolledDropdown>
     <DropdownToggle className='fa fa-lg fa-cog' color='light'></DropdownToggle>
     <DropdownMenu>
      <LinkContainer to={{
        pathname: `/classroom/${classId}/deleteClass`,
        state: {
          name: name,
        },
        }}>
         <DropdownItem>
          <Button color='danger' className='btn-block'> Delete Class </Button>
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

class Classroom extends Component {

  constructor(props) {
    super(props);

    this.handleError = this.handleError.bind(this);
  }

  handleError(err) {
    this.props.showNotification(error({
      title: 'Error',
      message: err.message,
      autoDismiss: 500,
    }));
  }

  render() {
    const {classId, name, owner} = this.props;
    const {notifications} = this.props;
    return (
      <div>
        <Notifications
          notifications={notifications}
        />
        <Row className='align-items-center'>
          <Col xs='2' className='text-left'>
            <LinkContainer to='/coach'>
              <div className='btn'>
                <i className='fa fa-lg fa-arrow-left'></i>
              </div>
            </LinkContainer>
          </Col>
          <Col xs='8'>
            <h1 className='text-center'>{this.props.name} </h1>
          </Col>
          <Col xs='2' className='text-right'>
            {
              owner?
              <SettingsList classId={classId} name={name}/>:
              <span></span>
            }
          </Col>
        </Row>
        <Row>
          <Col>
            <StudentPortal
              {...this.props}
              students={this.props.students}
              classId={classId}
              name={name}
              owner={owner}
            />
          </Col>
          <Col>
            <ContestPortalContainer classId={classId} owner={owner} />
            <ProblemListClassroom {...this.props} handleError={this.handleError} />
          </Col>
        </Row>
      </div>
    );
  }
}

/** PropTypes */
Classroom.propTypes = {
  classId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  students: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
  })).isRequired,
  owner: PropTypes.bool.isRequired,
};

export default Classroom;
