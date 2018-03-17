import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {LinkContainer} from 'react-router-bootstrap';
import PropTypes from 'prop-types';
import {Form, Button, Input, Label, FormGroup} from 'reactstrap';

import {asyncUsernameToUserId} from 'components/utility';

class AddStudent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      student: '',
      fireRedirect: false,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  async handleSubmit(e) {
    e.preventDefault();

    if (!this.state.student) {
      return alert('Student username cannot be empty');
    }

    let student = this.state.student;

    try {
      student = await asyncUsernameToUserId(student);
      const data = {
        student,
      };
      const {classId} = this.props.match.params;
      const api = `/api/v1/classrooms/${classId}/students`;
      let resp = await fetch(api, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
        credentials: 'same-origin',
      });
      resp = await resp.json();
      if ( resp.status !== 201 ) {
        throw resp;
      }
      this.setState({fireRedirect: true});
    } catch (err) {
      console.log(err);
      if (err.status) alert(err.message);
      return;
    }
  }

  render() {
    return (
      <div>
        <h1> Add Student </h1>
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label>Student Username</Label>
            <Input
              name='student'
              placeholder='Username'
              onChange={ this.handleInputChange }
            />
          </FormGroup>
          <Button color='primary' type='submit'>Save</Button>
          <LinkContainer to={`/classroom/${this.props.match.params.classId}`}>
            <Button className='ml-1'> Cancel</Button>
          </LinkContainer>
        </Form>

        {this.state.fireRedirect &&
          (<Redirect to={`/classroom/${this.props.match.params.classId}`}/>)}
      </div>
    );
  }
}

AddStudent.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      classId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default AddStudent;
