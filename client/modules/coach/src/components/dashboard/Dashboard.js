import React, {Component} from 'react';
import {LinkContainer} from 'react-router-bootstrap';
import {
    Row, Col, Button, UncontrolledDropdown, DropdownToggle, DropdownMenu,
    DropdownItem,
} from 'reactstrap';

import ClassroomList from './ClassroomList';

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

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classDetails: [],
    };
  }

  async componentDidMount() {
    try {
      const api = '/api/v1/classrooms';
      let resp = await fetch(api, {
        method: 'get',
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin',
      });
      resp = await resp.json();
      if (resp.status !== 200) {
        throw resp;
      }
      this.setState({
        classDetails: resp.data,
      });
      return;
    } catch (err) {
      if (err.status) alert(err.message);
      console.log(err);
      return;
    }
  }

  render() {
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
            <ClassroomList classrooms={this.state.classDetails}/>
          </Col>
        </Row>
      </div>
    );
  }
}
